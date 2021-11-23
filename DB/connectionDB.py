import os
import mysql.connector


class DbConnection:
# 'baudhik_geeks'
  conn = mysql.connector.connect(user=os.environ["DbUser"], 
                                password= os.environ["DbPass"],
                                host=os.environ["DbHost"],
                                database='baudhik_geeks')
  cur = conn.cursor()

  def moNoExists(self,mobileNo):
    # chechk if the no is aleready registered or not
    query = "select count(*) as cnt from user where mobile_no = '{mobile}';".format(mobile=mobileNo)
    self.cur.execute(query)
    result=self.cur.fetchone()
    if(result[0]>=1):
      return 101
  
  @staticmethod
  def closeConnection(self):
    self.db.close()