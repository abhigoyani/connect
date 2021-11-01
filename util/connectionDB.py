import os
import mysql.connector


class DbConnection:

  db = mysql.connector.connect(user=os.environ['NWkzT7ag7I'], 
                                password=os.environ['41UveD1C3C'],
                                host='remotemysql.com',
                                database='NWkzT7ag7I')
  
  def closeConnection(self):
    self.db.close()