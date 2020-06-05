import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/api/data/base/page',
    method: 'post',
    data
  })
}
