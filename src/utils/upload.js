import axios from 'axios'

export function upload(file) {
  var api = 'https://file.szaiaitie.com/Api/Upload/UploadListPic'
  var data = new FormData()
  data.append('file', file)
  data.append('folderName', 'laiaiTest')
  data.append('time', '1526712575167')
  data.append('cipher', '338D36C27ECF4FBE302F2B2C42A6F1BF1213')
  return axios.post(api, data)
}
