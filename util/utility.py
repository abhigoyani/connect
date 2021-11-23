from secrets import token_hex

def generateToken(mobile):
  token1= token_hex(9)
  token2 = token_hex(9)

  if mobile != None:
    TOKEN = token1+"_"+mobile+"-"+token2
    print(TOKEN) 
    return TOKEN
  else:
    return None
