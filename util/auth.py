import os
from twilio.rest import Client

class Verify:

    def __init__(self):
        self.client = Client(os.environ['TWILIO_ACCOUNT_SID'], os.environ['TWILIO_AUTH_TOKEN'])


    def createNewAuthService(self):
        service = self.client.verify.services.create(
                                     friendly_name='My First Verify Service'
                                 )
        print(service.__dict__)
        return(service.sid)

    
    def sendOtp(self,sid,moNo):
        verification = self.client.verify \
                     .services(sid) \
                     .verifications \
                     .create(to=moNo, channel='sms')
    
    def verifyOtp(self,sid,moNo,code):
        verification_check = self.client.verify \
                           .services(sid) \
                           .verification_checks \
                           .create(to=moNo, code=code)
        return verification_check.status