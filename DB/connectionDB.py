import os
import mysql.connector


class DbConnection:
# 'baudhik_geeks'

  def __init__(self):
    self.conn = mysql.connector.connect(user=os.environ["DbUser"], 
                                  password= os.environ["DbPass"],
                                  host=os.environ["DbHost"],
                                  database='baudhik_geeks')
    self.cur = self.conn.cursor()

  def moNoExists(self,mobileNo):
    # chechk if the no is aleready registered or not
    try:
      query = "select count(*) as cnt from user where mobile_no = '{mobile}';".format(mobile=mobileNo)
      self.cur.execute(query)
      result=self.cur.fetchone()
      if(result[0]>=1):
        return 101
    except mysql.connector.IntegrityError:
      return 104
    except mysql.connector.Error as e:
      print(e)
      return 103

  
  def userNameExists(self,userName):
    try:
      query = "select count(*) as cnt from user where username = '{username}';".format(username=userName)
      self.cur.execute(query)
      result = self.cur.fetchone()
      if(result[0]>=1):
        return 102
    except mysql.connector.IntegrityError:
      return 104
    except mysql.connector.Error as e:
      print(e)
      return 103
    
  
  def userRegisterTemp(self, userName, moNo):
    try:
      query = "Insert into temp_user(mobile,username) values('{}','{}');".format(moNo,userName)

      self.cur.execute(query)
      self.conn.commit()
    except mysql.connector.IntegrityError:
      return 104
    except mysql.connector.Error:
      return 103

  
  def userRegisterMain(self,moNo):
    try:
      query = "insert into user (mobile_no,username) select mobile,username from temp_user where mobile='{}' ;".format(moNo)
      self.cur.execute(query)
      self.conn.commit()
    except mysql.connector.IntegrityError:
      return 104
    except mysql.connector.Error:
      return 103

  def addNewSession(self, token, moNO, device):
    try:
      query="Insert into active_session (mobile_no,session_token,device_detail) values('{}','{}','{}');".format(moNO,token,device)
      self.cur.execute(query)
      self.conn.commit()
    except mysql.connector.Error : 
      return 103
  
  def deleteFromTemp(self,moNo):
    try:
      query = f"delete from temp_user where mobile='{moNo}'"
      self.cur.execute(query)
      self.conn.commit()
    except mysql.connector.Error:
      return 103
  
  
  @staticmethod
  def closeConnection(self):
    self.db.close()
    