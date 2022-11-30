from secrets import token_hex
from DB.connectionDB import DbConnection


def generateToken(mobile):
  token1= token_hex(9)
  token2 = token_hex(9)

  if mobile != None:
    TOKEN = token1+"_"+mobile+"-"+token2
    print(TOKEN) 
    return TOKEN
  else:
    return None

def checkToken(token):
  conn = DbConnection().conn
  cur = DbConnection().cur
  try:
    query=f"select count(*) as cnt from user where token='{token}'"
    cur.execute(query)
    result = cur.fetchone()
    if(result[0]==1):
      return 1
    else:
      return 0
  except Exception as e:
    print(e)
    return 103
    
  
