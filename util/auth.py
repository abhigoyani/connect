import os
from twilio.rest import Client
from DB.connectionDB import DbConnection
from twilio.base.exceptions import TwilioRestException

class Verify:

    def __init__(self):
        self.client = Client(os.environ['TWILIO_ACCOUNT_SID'], os.environ['TWILIO_AUTH_TOKEN'])


    def createNewAuthService(self):
        service = self.client.verify.services.create(
                                     friendly_name='Connect authorise login'
                                 )
        return(service.sid)

    
    def sendOtp(self,sid,moNo):
      try:
        verification = self.client.verify \
                     .services(sid) \
                     .verifications \
                     .create(to=moNo, channel='sms')
        #print(verification.__dict__)
        return verification.status
      except TwilioRestException as e:
        print(e)
        delEntry = DbConnection().deleteFromTemp(moNo)
        if delEntry == 103 :
          return delEntry

        return e.code
    
    def verifyOtp(self,sid,moNo,code):
      try:
        verification_check = self.client.verify \
                           .services(sid) \
                           .verification_checks \
                           .create(to=moNo, code=code)
        return verification_check.status
      except TwilioRestException as e:
        return e.code