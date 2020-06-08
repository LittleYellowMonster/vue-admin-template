import request from '@/utils/request'

export function getDataBaseList(data, page, limit) {
  return request({
    url: '/api/data/base/page?current=' + page + '&pageSize=' + limit,
    method: 'post',
    data
  })
}
