import request from '@/utils/request'

export function getDataBaseList(data, page, limit) {
  return request({
    url: '/api/data/base/page?current=' + page + '&pageSize=' + limit,
    method: 'post',
    data
  })
}
export function createDataBase(data) {
  return request({
    url: '/api/data/base',
    method: 'post',
    data
  })
}
export function updateDataBase(data) {
  return request({
    url: '/api/data/base',
    method: 'put',
    data
  })
}
export function deleteDataBase(id) {
  return request({
    url: '/api/data/base/' + id,
    method: 'delete'
  })
}
