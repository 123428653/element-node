import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-element-admin/user/login',
//     method: 'post',
//     data
//   })
// }

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-element-admin/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function getInfo() {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }

export function logout() {
  return request({
    url: '/admin/user/logout',
    method: 'post'
  })
}
