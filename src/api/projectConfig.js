import request from '@/utils/request'

export function getPage(data, page, limit) {
  return request({
    url: '/api/project/config/page?current=' + page + '&pageSize=' + limit,
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/api/project/config',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/api/project/config',
    method: 'put',
    data
  })
}

export function deleteById(id) {
  return request({
    url: '/api/project/config' + id,
    method: 'delete'
  })
}
