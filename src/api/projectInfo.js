import request from '@/utils/request'

export function getPage(data, page, limit) {
  return request({
    url: '/api/project/info/page?current=' + page + '&pageSize=' + limit,
    method: 'post',
    data
  })
}

export function getList(data) {
  return request({
    url: '/api/project/info/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/api/project/info',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/api/project/info',
    method: 'put',
    data
  })
}

export function deleteById(id) {
  return request({
    url: '/api/project/info' + id,
    method: 'delete'
  })
}
