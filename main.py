from flask import Flask, jsonify, request
from flask_cors import CORS
from util.auth import Verify
from DB.connectionDB import DbConnection
import mysql
from util.utility import generateToken,checkToken

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
      return jsonify({"sid": sid,"stcode":100,"status":sts}), 200

    elif mobileExists == 104 or mobileExists == 103:
      return jsonify({"sid": "0","stcode":mobileExists}), 200

    else:
      return jsonify({"stcode":101}),200
      
###########################################################################

@app.route("/signup", methods=["POST"])
def signup():
  values= request.get_json()
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
    return jsonify({"sid": "0","stcode":mobileExists}), 200
  
  #Checking username exists or not
  userNameExists = conn.userNameExists(values['username'])
  if userNameExists == 102 or userNameExists == 104 or userNameExists == 103:
    return jsonify({"sid": "0","stcode":userNameExists}), 200

  #Inserting data to temp table
  userInsertTemp =  conn.userRegisterTemp(values['username'],values['mobileNo'])
  if userInsertTemp == 104 or userInsertTemp == 103:
    return jsonify({"sid": "0","stcode":userInsertTemp}), 200

  sid = verify.createNewAuthService()
  sts = verify.sendOtp(sid, values['mobileNo'])

  return jsonify({"sid": sid, "status": sts,"stcode":100}), 200

###########################################################################

@app.route('/verifyOtp', methods=["POST"])
def verifyOtp():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = ['mobileNo', 'sid', 'otp','device','msg']
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400
    
    msg = values['msg']

    sts = verify.verifyOtp(sid=values['sid'],
                           moNo=values['mobileNo'],
                           code=values['otp'])
    if(sts=="approved"):
      conn = DbConnection()
      TOKEN = generateToken(values['mobileNo'])
      try:
        # VERIFY OTP FROM SIGNUP 
        if(msg=='signup'):
          registerNewUser = conn.userRegisterMain(values['mobileNo'])
          if registerNewUser == 103 or registerNewUser == 104:
            return jsonify({"sid": "0","stcode":registerNewUser})

          addSession = conn.addNewSession(TOKEN,values['mobileNo'],values['device'])
          if registerNewUser == 103:
            return jsonify({"sid": "0","stcode":registerNewUser})
    
          return jsonify({"sid": "0", "status": sts,"token":TOKEN,"stcode":100}),200
          
        #VERIFY OTP LOGIN
        if(msg=='login'):
          addSession = conn.addNewSession(TOKEN,values['mobileNo'],values['device'])
          return jsonify({"sid": "0", "status": sts,"token":TOKEN,"stcode":100}),200

      except mysql.connector.Error as e:
        print(e)
        return jsonify({"sid": "0", "status": "Dberror","stcode":103}), 200

    return jsonify({"status": sts,"stcode":100}), 200

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
    return jsonify({"status":sts}),200

###########################################################################
@app.route("/home_user_profile_update", methods=["POST"])
def home_user_profile_update():
  values = request.get_json()
  if not values:
    return jsonify({'message': 'No data found.'}), 400
  required = ['token','name','bio']
  if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400
  
  if(checkToken(values['token'])==103):
    return jsonify({"status": "Dberror","stcode":103}),200
  elif not checkToken(values['token']):
    return jsonify({"status":"token not found","stcode":105}),200
  
  
    
  

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=6969)
