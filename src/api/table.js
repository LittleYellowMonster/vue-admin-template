import request from '@/utils/request'

export function getDataBaseList(data) {
  console.log(data)
  return request({
    url: '/api/data/base/page?current=' + data.page + '&pageSize=' + data.limit,
    method: 'post',
    data
  })
}
