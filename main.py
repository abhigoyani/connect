from flask import Flask, jsonify, request
from flask_cors import CORS
from util.auth import Verify
from DB.connectionDB import DbConnection
import mysql
from util.utility import generateToken

app = Flask(__name__)
CORS(app)

verify = Verify()
CUR = DbConnection.cur
CONN = DbConnection.conn


###########################################################################

@app.route('/login', methods=["POST"])
def login():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    if 'mobileNo' not in values:
        return jsonify({'message': 'Mo no not found.'}), 400

    sid = verify.createNewAuthService()
    sts = verify.sendOtp(sid, values['mobileNo'])
    return jsonify({"sid": sid, "status": sts}), 200

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
  
  try:
    #Checking mobile exists or not
    
    CUR.execute(query)
    result=CUR.fetchone()
    if(result[0]>=1):
       return jsonify({"sid": "0", "status": "mobile exists","stcode":101}), 200

    #Checking username exists or not
    query = "select count(*) as cnt from user where username = '{username}';".format(username=values['username'])
    CUR.execute(query)
    result = CUR.fetchone()
    if(result[0]>=1):
       return jsonify({"sid": "0", "status": "username exists","stcode":102}), 200

    #Inserting data to temp table
    query = "Insert into temp_user(mobile,username) values('{}','{}');".format(values['mobileNo'],values['username'])

    CUR.execute(query)
    CONN.commit()
    sid = verify.createNewAuthService()
    sts = verify.sendOtp(sid, values['mobileNo'])

  except mysql.connector.IntegrityError:
    print("Integrity erorr")
    return jsonify({"sid": "0", "status": "Integrityerror","stcode":104}), 200
  except mysql.connector.Error as e:
    print(e)
    return jsonify({"sid": "0", "status": "Dberror","stcode":103}), 200

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

    sts = verify.verifyOtp(sid=values['sid'],
                           moNo=values['mobileNo'],
                           code=values['otp'])
    if(sts=="approved"):
      TOKEN = generateToken(values['mobileNo'])
      try:
        if(msg=='signup'):
          query = "insert into user (mobile_no,username) select mobile,username from temp_user where mobile='{}' ;".format(values['mobileNo'])
          CUR.execute(query)
          CONN.commit()
        
        query="Insert into active_session (mobile_no,session_token,device_detail) values('{}','{}','{}');".format(values['mobileNo'],TOKEN,values['device'])
        CUR.execute(query)
        CONN.commit()
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


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=6969)
