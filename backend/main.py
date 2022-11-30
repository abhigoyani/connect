from flask import Flask, jsonify, request
from flask_cors import CORS
from util.auth import Verify
from DB.connectionDB import DbConnection
import mysql
from util.utility import generateToken, checkToken, allowed_extention, uniqueUrl
from DB.blobStorage import BlobStore
ok
app = Flask(__name__)
CORS(app)

verify = Verify()

###########################################################################


@app.route('/login', methods=["POST"])
def login():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    if 'mobileNo' not in values:
        return jsonify({'message': 'Mo no not found.'}), 400

    conn = DbConnection()
    #checking mobile exists or not
    mobileExists = conn.moNoExists(values['mobileNo'])
    if mobileExists == 101:
        sid = verify.createNewAuthService()
        sts = verify.sendOtp(sid, values['mobileNo'])
        return jsonify({"sid": sid, "stcode": 100, "status": sts}), 200

    elif mobileExists == 104 or mobileExists == 103:
        return jsonify({"sid": "0", "stcode": mobileExists}), 200

    else:
        return jsonify({"stcode": 101}), 200


###########################################################################


@app.route("/signup", methods=["POST"])
def signup():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    if 'mobileNo' not in values:
        return jsonify({'message': 'Mo no not found.'}), 400
    if 'username' not in values:
        return jsonify({'message': 'Username no not found.'}), 400

    conn = DbConnection()

    #Checking mobile exists or not
    mobileExists = conn.moNoExists(values['mobileNo'])
    if mobileExists == 101 or mobileExists == 103 or mobileExists == 104:
        return jsonify({"sid": "0", "stcode": mobileExists}), 200

    #Checking username exists or not
    userNameExists = conn.userNameExists(values['username'])
    if userNameExists == 102 or userNameExists == 104 or userNameExists == 103:
        return jsonify({"sid": "0", "stcode": userNameExists}), 200

    #Inserting data to temp table
    userInsertTemp = conn.userRegisterTemp(values['username'],
                                           values['mobileNo'])
    if userInsertTemp == 104 or userInsertTemp == 103:
        return jsonify({"sid": "0", "stcode": userInsertTemp}), 200

    sid = verify.createNewAuthService()
    sts = verify.sendOtp(sid, values['mobileNo'])

    return jsonify({"sid": sid, "status": sts, "stcode": 100}), 200


###########################################################################


@app.route('/verifyOtp', methods=["POST"])
def verifyOtp():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = ['mobileNo', 'sid', 'otp', 'device', 'msg']
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400

    msg = values['msg']

    sts = verify.verifyOtp(sid=values['sid'],
                           moNo=values['mobileNo'],
                           code=values['otp'])
    if (sts == "approved"):
        conn = DbConnection()
        TOKEN = generateToken(values['mobileNo'])
        try:
            # VERIFY OTP FROM SIGNUP
            if (msg == 'signup'):
                registerNewUser = conn.userRegisterMain(values['mobileNo'])
                if registerNewUser == 103 or registerNewUser == 104:
                    return jsonify({"sid": "0", "stcode": registerNewUser})

                addSession = conn.addNewSession(TOKEN, values['mobileNo'],
                                                values['device'])
                if registerNewUser == 103:
                    return jsonify({"sid": "0", "stcode": registerNewUser})

                return jsonify({
                    "sid": "0",
                    "status": sts,
                    "token": TOKEN,
                    "stcode": 100
                }), 200

            #VERIFY OTP LOGIN
            if (msg == 'login'):
                addSession = conn.addNewSession(TOKEN, values['mobileNo'],
                                                values['device'])
                return jsonify({
                    "sid": "0",
                    "status": sts,
                    "token": TOKEN,
                    "stcode": 100
                }), 200

        except mysql.connector.Error as e:
            print(e)
            return jsonify({
                "sid": "0",
                "status": "Dberror",
                "stcode": 103
            }), 200

    return jsonify({"status": sts, "stcode": 100}), 200


###########################################################################


@app.route("/resendOtp", methods=["POST"])
def sendOtp():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = [
        'mobileNo',
        'sid',
    ]
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400
    sts = verify.sendOtp(sid=values["sid"], moNo=values['mobileNo'])
    return jsonify({"status": sts}), 200


###########################################################################
@app.route("/user-profile-update", methods=["POST"])
def home_user_profile_update():
    values = request.form.to_dict()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = [
        'token',
        'name',
        'bio',
        'avatarUP',
        'bannerUP',
        'textUpdt',
    ]
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400

    #check for the token if found get mobile no
    mobile, username = checkToken(values['token'])
    if (mobile == 103):
        return jsonify({"status": "Dberror", "stcode": 103}), 200
    elif not mobile:
        return jsonify({"status": "token not found", "stcode": 105}), 200

    dbCon = DbConnection()
    if int(values['textUpdt']) == 1:
        if dbCon.updateUserNameBio(values['name'], values['bio'],
                                   mobile) == 103:
            return jsonify({"sid": "0", "status": "Dberror", "stcode": 103})

    if int(values['avatarUP']) == 1:
        if (dbCon.avatarflagdb(mobile, int(values['avatarUP'])) == 103):
            return jsonify({"status": "Dberror", "stcode": 103}), 200
        avtr = request.files['avatar']
        if avtr and (avtr.filename != '') and (allowed_extention(
                avtr.filename)):
            blobstr = BlobStore()
            if blobstr.uplodeAvatar(avtr, username) == 169:
                return jsonify({
                    "status": "blobStoreError",
                    "stcode": 169
                }), 200
        else:
            return jsonify({"status": "file not found", "stcode": 106}), 401

    if int(values['bannerUP']) == 1:
        if (dbCon.bannerflagdb(mobile, int(values['bannerUP'])) == 103):
            return jsonify({"status": "Dberror", "stcode": 103}), 200
        avtr = request.files['banner']
        if avtr and (avtr.filename != '') and (allowed_extention(
                avtr.filename)):
            blobstr = BlobStore()
            if blobstr.uplodeBanner(avtr, username) == 169:
                return jsonify({
                    "status": "blobStoreError",
                    "stcode": 169
                }), 200
        else:
            return jsonify({"status": "file not found", "stcode": 106}), 401

    return jsonify({"status": "updated success", "stcode": 100}), 200


############################################################################


@app.route("/user-profile-fetch-moNO", methods=["POST"])
def home_user_profile_fetch():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = ['token']
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400

    #checking token
    mobile, username = checkToken(values['token'])
    if (mobile == 103):
        return jsonify({"status": "Dberror", "stcode": 103}), 200
    elif not mobile:
        return jsonify({"status": "token not found", "stcode": 105}), 200

    if mobile == None or username == None:
        return jsonify({"status": "No token found", "stcode": 105}), 200
    else:
        conn = DbConnection()
        ans = conn.fetchUsernameBio(username)
        if ans == 107:
            return jsonify({"status": "Data Not found", "stcode": 107}), 200
        elif ans == 103:
            return jsonify({"status": "Dberror", "stcode": 103}), 200
        else:
            name, bio, a, b = ans
            return jsonify({
                "status": "success",
                "stcode": 100,
                "username": username,
                "name": name,
                "bio": bio,
                "avatarflag": a,
                "bannerflag": b
            }), 200


############################################################################


@app.route("/add_socials", methods=["POST", "DELETE"])
def addSocialsUrl():
    values = request.form.to_dict()
    print(values)
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = ['token', 'title', 'socialURL']
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400

    #checking token
    mobile, username = checkToken(values['token'])
    if (mobile == 103):
        return jsonify({"status": "Dberror", "stcode": 103}), 200
    elif not mobile:
        return jsonify({"status": "token not found", "stcode": 105}), 200

    #uplode img
    iconurl = uniqueUrl()
    #try:
    if "icon" in request.files:
        icon = request.files['icon']
        if icon and (icon.filename != '') and (allowed_extention(
                icon.filename)):
            blobstr = BlobStore()
            if blobstr.uplodeIcon(icon, username + '-' + iconurl+ '.jpg') == 169:
                return jsonify({
                    "status": "blobStoreError",
                    "stcode": 169
                }), 200
        else:
            return jsonify({"status": "file not found", "stcode": 106}), 401
    #except Exception as e:
    #   print(e)
    #   return jsonify({"status":"Azure error","stcode":110}),200

    conn = DbConnection()
    #genrate uniqe url
    if conn.addSocials(title=values['title'],
                       username=username,
                       link=values["socialURL"],
                       iconUrl=username+ '-' + iconurl + '.jpg') == 103:
        return jsonify({"status": "Dberror", "stcode": 103}), 200

    return jsonify({
        "status": "success",
        "stcode": 100,
        "iconURL": iconurl
    }), 200


############################################################################


@app.route("/deleteAvatar", methods=["POST"])
def deleteAvatar():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = [
        'token',
    ]
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400

    #checking token
    mobile, username = checkToken(values['token'])
    if (mobile == 103):
        return jsonify({"status": "Dberror", "stcode": 103}), 200
    elif not mobile:
        return jsonify({"status": "token not found", "stcode": 105}), 200

    bolbstr = BlobStore()
    if bolbstr.deleteAvatar(username) == 169:
        return jsonify({"status": "blobStoreError", "stcode": 169}), 200

    if (DbConnection().avatarflagdb(mobile, 0) == 103):
        return jsonify({"status": "Avatar Flag Dberror", "stcode": 103}), 200

    return jsonify({"status": "avatar removed", "stcode": 100}), 200


############################################################################


@app.route("/deleteBanner", methods=["POST"])
def deleteBanner():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = ['token']
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400

    #checking token
    mobile, username = checkToken(values['token'])
    if (mobile == 103):
        return jsonify({"status": "Dberror", "stcode": 103}), 200
    elif not mobile:
        return jsonify({"status": "token not found", "stcode": 105}), 200

    bolbstr = BlobStore()
    if bolbstr.deleteBanner(username=username) == 169:
        return jsonify({"status": "blobStoreError", "stcode": 169}), 200

    if (DbConnection().bannerflagdb(mobile, 0) == 103):
        return jsonify({"status": "Banner Flag Dberror", "stcode": 103}), 200

    return jsonify({"status": "banner removed", "stcode": 100}), 200


############################################################################


@app.route("/fetchSocials", methods=["POST"])
def fetchsocials():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = ['username']
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400

    conn = DbConnection()
    socials = conn.fetchProfile(values['username'])
    profile = conn.fetchUsernameBio(values['username'])

    
    if (socials == 103 or profile == 103):
        return jsonify({"status": "Dberror", "stcode": 103}), 200
    elif (socials == 107 or profile == 107):
        return jsonify({"status": "Data Not found", "stcode": 107}), 200
    else:
        temp_dict = {}
        temp_list = []
        
        for social in socials:
            temp_dict['link'] = social[0]
            temp_dict['title'] = social[1]
            temp_dict['icon'] = social[2]
            temp_list.append(temp_dict)
            temp_dict = {}

        name,bio,avatar,banner = profile 
        return jsonify({
            "status": "success",
            "stcode": 100,
            "socialData": temp_list,
            "name":name,
            "bio":bio,
            "avatar":avatar,
            "banner":banner,
        }), 200

############################################################################

@app.route("/deleteURL", methods=["POST"])
def deleteURL():
  values = request.get_json()
  if not values:
      return jsonify({'message': 'No data found.'}), 400
  required = ['token','url']
  if not all(key in values for key in required):
      return jsonify({'message': 'Data missing.'}), 400 
  
  mobile, username = checkToken(values['token'])
  if (mobile == 103):
      return jsonify({"status": "Dberror", "stcode": 103}), 200
  elif not mobile:
      return jsonify({"status": "token not found", "stcode": 105}), 200
  
  conn = DbConnection()
  iconURL, title = conn.deleteSocial(username = username,url=values["url"])
  if iconURL == 103:
    return jsonify({"status": "Dberror", "stcode": 103,"title":title}), 200
  elif iconURL == 107:
    return jsonify({"status": "data not found", "stcode": 107,"title":title}), 200


  bolbstr = BlobStore()
  if bolbstr.deleteIcon(iconURL=iconURL) == 169:
      return jsonify({"status": "blobStoreError", "stcode": 169,"title":title}), 200
  
  return jsonify({"status": "icon removed", "stcode": 100,"title":title}), 200

############################################################################
  
@app.route("/editURL", methods=["POST"])
def editURL():

  values = request.form.to_dict()
  print(values)
  if not values:
      return jsonify({'message': 'No data found.'}), 400
  required = ['token','url','title','iconURL']
  if not all(key in values for key in required):
      return jsonify({'message': 'Data missing.'}), 400
  
  mobile, username = checkToken(values['token'])
  if (mobile == 103):
      return jsonify({"status": "Dberror", "stcode": 103}), 200
  elif not mobile:
      return jsonify({"status": "token not found", "stcode": 105}), 200
 
  if "icon" in request.files:
        icon = request.files['icon']
        if icon and (icon.filename != '') and (allowed  _extention(
                icon.filename)):
            blobstr = BlobStore()
            if blobstr.uplodeIcon(icon,values["iconURL"]) == 169:
                return jsonify({
                    "status": "blobStoreError",
                    "stcode": 169
                }), 200
        else:
            return jsonify({"status": "file not found", "stcode": 106}), 401
    
  conn = DbConnection()
  result = conn.editSocial(username,values['url'],values['title'],values['iconURL'])

  if(result == 103):
      return jsonify({"status": "Dberror", "stcode": 103}), 200

  return jsonify({"status": "updated", "stcode": 100}), 200
  
############################################################################

@app.route("/fetchDevice", methods=["POST"])
def fetchdevice():
  values=request.get_json()
  if not values:
      return jsonify({'message': 'No data found.'}), 400
  if not 'token' in values:
      return jsonify({'message': 'Data missing.'}), 400

  mobile, username = checkToken(values['token'])
  if (mobile == 103):
      return jsonify({"status": "Dberror", "stcode": 103}), 200
  elif not mobile:
      return jsonify({"status": "token not found", "stcode": 105}), 200  

  con = DbConnection()
  res = con.fetchDevice(mobile)
  if res == 103:
    return jsonify({"status": "Dberror", "stcode": 103}), 200
  elif res == 107:
    return jsonify({"status": "data not found", "stcode": 107}), 200
  else:
    temp_lst=[]
    for i in res:
      for j in i:
        temp_lst.append(j)

    return jsonify({"status": "sucess", "stcode": 100,"devices":temp_lst,"total":len(res)}), 200

############################################################################

@app.route("/signOut", methods=["POST"])
def signout():
  values=request.get_json()
  if not values:
      return jsonify({'message': 'No data found.'}), 400
  if not 'token' in values:
      return jsonify({'message': 'Data missing.'}), 400

  mobile, username = checkToken(values['token'])
  if (mobile == 103):
      return jsonify({"status": "Dberror", "stcode": 103}), 200
  elif not mobile:
      return jsonify({"status": "token not found", "stcode": 105}), 200
  
  conn = DbConnection()
  res = conn.signOUT(values['token'])

  if(res==103):
        return jsonify({"status": "Dberror", "stcode": 103}), 200
  else:
    return jsonify({"status": "sucess", "stcode": 100}), 200

  
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=7969)
