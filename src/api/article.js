import request from '@/utils/request'

export function crtArticle(data) {
  return request({
    url: '/admin/article/create',
    method: 'post',
    data
  })
}

export function articleList(query) {
  return request({
    url: '/admin/article/list',
    params: query
  })
}

export function getArticle(id) {
  return request({
    url: '/admin/article/detail',
    params: { id }
  })
}

export function updateArticle(data) {
  return request({
    url: '/admin/article/update',
    method: 'post',
    data
  })
}

export function uploadImg(data) {
  return request({
    url: '/admin/article/upload',
    method: 'post',
    data
  })
}

export function delImg(data) {
  return request({
    url: '/admin/article/delImg',
    method: 'post',
    data
  })
}

// export function fetchList(query) {
//   return request({
//     url: '/vue-element-admin/article/list',
//     method: 'get',
//     params: query
//   })
// }

// export function fetchArticle(id) {
//   return request({
//     url: '/vue-element-admin/article/detail',
//     method: 'get',
//     params: { id }
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// export function createArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/create',
//     method: 'post',
//     data
//   })
// }

// export function updateArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/update',
//     method: 'post',
//     data
//   })
// }
