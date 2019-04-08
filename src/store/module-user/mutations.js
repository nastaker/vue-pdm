const keyUser = 'user'
const keyParam = 'param'

export function setUser (state, value) {
  state.user = value
  localStorage.setItem(keyUser, JSON.stringify(value))
}
export function setToken (state, value) {
  state.user.token = value
  localStorage.setItem(keyUser, JSON.stringify(state.user))
}
export function setParam (state, value) {
  localStorage.setItem(keyParam, JSON.stringify(value))
}
export function setUserRole (state, value) {
  state.user.rolename = value
}
export function removeUser (state) {
  state.user = null
  localStorage.removeItem(keyUser)
}
export function setModal (state, value) {
  state.modal = value
}

