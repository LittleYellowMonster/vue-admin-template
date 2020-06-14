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
export function testDbConnect(data) {
  return request({
    url: 'api/data/base/testConnect',
    method: 'post',
    data
  })
}
export function getTablePage(data, page, limit) {
  return request({
    url: '/api/data/base//table/page?current=' + page + '&pageSize=' + limit,
    method: 'post',
    data
  })
}

export function tableListSync(data) {
  return request({
    url: '/api/data/base/sync',
    method: 'post',
    data
  })
}
