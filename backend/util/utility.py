from secrets import token_hex
from DB.connectionDB import DbConnection
import mysql.connector
from uuid import uuid4

def generateToken(mobile):
  token1= token_hex(9)
  token2 = token_hex(9)

  if mobile != None:
    TOKEN = token1+"_"+mobile[3:-2]+mobile[5:-1]+"-"+token2
    print(TOKEN) 
    return TOKEN
  else:
    return None

def checkToken(token):
  connection = DbConnection()
  cur = connection.cur
  try:
    query=f"select mobile_no,count(*) as cnt from active_session where session_token='{token}'"
    cur.execute(query)
    result = cur.fetchone()
    if(result[1]==1):
      query=f"select mobile_no,username from user where mobile_no='{result[0]}'"
      cur.execute(query)
      result = cur.fetchone()
      return result
    else:
      return (0,0)
  except mysql.connector.Error as e:
    print(e)
    return (103,0)
    
  
def allowed_extention(filename):
  ALLOWED_EXTENSIONS = { 'png', 'jpg', 'jpeg'}
  return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def uniqueUrl():
  return uuid4().hex