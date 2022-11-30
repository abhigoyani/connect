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

#--------------------------------------------------------------------------#

  def moNoExists(self,mobileNo):
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

#--------------------------------------------------------------------------#
  
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
    
#--------------------------------------------------------------------------#

  def userRegisterTemp(self, userName, moNo):
    try:
      query = "Insert into temp_user(mobile,username) values('{}','{}');".format(moNo,userName)

      self.cur.execute(query)
      self.conn.commit()
    except mysql.connector.IntegrityError:
      return 104
    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#
 
  def userRegisterMain(self,moNo):
    try:
      query = "insert into user (mobile_no,username) select mobile,username from temp_user where mobile='{}' ;".format(moNo)
      self.cur.execute(query)
      self.conn.commit()

      query=f"insert into user_profile(mobile_no,name,username) select mobile,username,username from temp_user where mobile='{moNo}';"
      self.cur.execute(query)
      self.conn.commit()
    except mysql.connector.IntegrityError:
      return 104  
    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#

  def addNewSession(self, token, moNO, device):
    try:
      query="Insert into active_session (mobile_no,session_token,device_detail) values('{}','{}','{}');".format(moNO,token,device)
      self.cur.execute(query)
      self.conn.commit()
    except mysql.connector.Error : 
      return 103

#--------------------------------------------------------------------------#
  
  def deleteFromTemp(self,moNo):
    try:
      query = f"delete from temp_user where mobile='{moNo}'"
      self.cur.execute(query)
      self.conn.commit()
    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#

  def updateUserNameBio(self,name,bio,mobile):
    try:
      query=f"update user_profile SET name='{name}',bio='{bio}' where mobile_no = '{mobile}'"
      self.cur.execute(query)
      self.conn.commit()
      
    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#

  def avatarflagdb(self,mobile,flag):
    try:
      query=f"update user_profile SET is_avatar='{flag}' where mobile_no='{mobile}'"
      self.cur.execute(query)
      self.conn.commit() 
    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#

  def bannerflagdb(self,mobile,flag):
    try:
      query=f"update user_profile SET is_banner='{flag}' where mobile_no='{mobile}'"
      self.cur.execute(query)
      self.conn.commit() 
    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#

  def fetchUsernameBio(self,username):
    try:
      query=f"select name,bio,is_avatar,is_banner from user_profile where username='{username}'"
      self.cur.execute(query)
      result = self.cur.fetchone()
      if not self.cur.rowcount:
        return 107
      else:
        return result

    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#

  def addSocials(self,username,link,title,iconUrl):
    try:
      query=f"insert into socials values('{username}','{link}','{title}','{iconUrl}')"
      self.cur.execute(query)
      self.conn.commit()
      
    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#
  def fetchProfile(self,username):
    try:
      query=f"select link,title,icon_url from socials where username ='{username}'"
      self.cur.execute(query)
      result = self.cur.fetchall()
      if not self.cur.rowcount:
        return 107
      else:
        return result
        
    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#
  def deleteSocial(self,username,url):
    try:
      query=f"select icon_url,title from socials where username='{username}' and link = '{url}'"
      self.cur.execute(query)
      result = self.cur.fetchone()
      if not self.cur.rowcount:
        return 107
      else:
        query=f"delete from socials where username='{username}'and link='{url}'"
        self.cur.execute(query)
        self.conn.commit()
        return result

    except mysql.connector.Error:
      return 103

#--------------------------------------------------------------------------#
  def editSocial(self,username,link,title,iconurl):
      try:
        query=f"update socials set link = '{link}',title = '{title}' where username = '{username}' and icon_url ='{iconurl}'"
        self.cur.execute(query)
        self.conn.commit()
      except mysql.connector.Error:
        return 103

#--------------------------------------------------------------------------#
  def fetchDevice(self,mobile):
    try:
      query=f"select device_detail from active_session where mobile_no ='{mobile}'"

      self.cur.execute(query)
      result = self.cur.fetchall()
      if not self.cur.rowcount:
        return 107
      else:
        return result
        
    except mysql.connector.Error:
      return 103
#--------------------------------------------------------------------------#
  def signOUT(self,token):
    try:
      query= f"delete from active_session where session_token='{token}'"
      self.cur.execute(query)
      self.conn.commit()
    except mysql.connector.Error:
        return 103
        
#--------------------------------------------------------------------------#
     
  @staticmethod
  def closeConnection(self):
    self.db.close()