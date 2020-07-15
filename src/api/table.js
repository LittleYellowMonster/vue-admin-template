import request from '@/utils/request'

export function getTablePage(data, page, limit) {
  return request({
    url: '/api/table/page?current=' + page + '&pageSize=' + limit,
    method: 'post',
    data
  })
}
export function tableListSync(data) {
  return request({
    url: '/api/table/sync',
    method: 'post',
    data
  })
}
