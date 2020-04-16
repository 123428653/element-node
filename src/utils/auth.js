import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  var h = +(1 / 24).toFixed(5) // 按小时计算
  return Cookies.set(TokenKey, token, { expires: h })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
