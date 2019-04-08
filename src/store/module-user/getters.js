const keyUser = 'user'
const keyParam = 'param'

export function getUser (state) {
  if (state.user == null) {
    // user: {token:"djaklfdjiofwms", key1: "value1", key2: "value2" }
    state.user = JSON.parse(localStorage.getItem(keyUser))
  }
  return state.user
}
export function getParam () {
  return JSON.parse(localStorage.getItem(keyParam))
}
export function getModal (state) {
  return state.modal
}
