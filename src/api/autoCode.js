import request from '@/utils/request'

export function generator(data) {
  return request({
    url: '/api/generator/previewCode',
    method: 'post',
    data
  })
}
export function createCode(data) {
  return request({
    url: '/api/generator/createCode',
    method: 'post',
    data
  })
}



