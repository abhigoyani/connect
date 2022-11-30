from azure.storage.blob import BlobServiceClient, BlobClient, __version__,ContentSettings
import os


class BlobStore:

  def __init__(self):
    self.blob_service_client = BlobServiceClient.from_connection_string(os.getenv('AZURE_STORAGE_CONNECTION_STRING'))

  def uplodeBanner(self,file,username):
    try:
      blob_client = self.blob_service_client.get_blob_client(container='banner', blob=username+'-banner.jpg')
      blob_client.upload_blob(file,overwrite=True)
    except Exception:
      return 169
  
  def uplodeAvatar(self,file,username):
    try:
      blob_client = self.blob_service_client.get_blob_client(container='avatar', blob=username+'-profile.jpg')
      blob_client.upload_blob(file,overwrite=True)
    except Exception as e:
      print(e)
      return 169

  def deleteAvatar(self,username):
    try:
      blob_client = self.blob_service_client.get_blob_client(container='avatar', blob=username+'-profile.jpg')
      blob_client.delete_blob()
    except Exception:
      return 169

  
  def deleteBanner(self,username):
    try:
      blob_client = self.blob_service_client.get_blob_client(container='banner', blob=username+'-banner.jpg')
      blob_client.delete_blob()
    except Exception as e:
      print(e)
      return 169


  def uplodeIcon(self,file,urlName):
    try:
      blob_client = self.blob_service_client.get_blob_client(container='icons', blob=urlName )
      blob_client.upload_blob(file,overwrite=True)
    except Exception as e:
      print(e)
      return 169
  
  def deleteIcon(self,iconURL):
    try:
      blob_client = self.blob_service_client.get_blob_client(container='icons', blob=iconURL)
      blob_client.delete_blob()
    except Exception as e:
      print(e)
      return 169