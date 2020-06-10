import request from '@/utils/request'

export function login(data) {
  // console.log(JSON.parse(this.date) + '=======')
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/admin/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/admin/logout',
    method: 'post'
  })
}

export function getList(data, page, limit) {
  return request({
    url: '/api/admin/page?current=' + page + '&pageSize=' + limit,
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/api/admin',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/api/admin',
    method: 'put',
    data
  })
}
export function deleteById(id) {
  return request({
    url: '/api/admin/' + id,
    method: 'delete'
  })
}
