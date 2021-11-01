from flask import Flask,jsonify,request
from flask_cors import CORS
from util.auth import Verify

app = Flask(__name__)
CORS(app)

verify = Verify()

@app.route('/signup',methods=["POST"])
def signup():
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    if 'mobileNo' not in values:
        return jsonify({'message': 'Mo no not found.'}), 400
    sid = verify.createNewAuthService()
    verify.sendOtp(sid,values['mobileNo'])
    return jsonify({"sid":sid}),200

@app.route('/verifyOtp',methods=["POST"])
def verifyOtp():
    values = request.get_json()
    values = request.get_json()
    if not values:
        return jsonify({'message': 'No data found.'}), 400
    required = ['mobileNo','sid','otp']
    if not all(key in values for key in required):
        return jsonify({'message': 'Data missing.'}), 400
    
    sts = verify.verifyOtp(sid=values['sid'],moNo=values['mobileNo'],code=values['otp'])
    return jsonify({"status":sts}),200

if __name__ == "__main__":
    app.run(host = '0.0.0.0',port=6969)