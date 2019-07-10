const keyGroupUser = 'groupUser'

export function setGroupUser (state, value) {
  state.groupUser = value
  localStorage.setItem(keyGroupUser, JSON.stringify(value))
}

export function clearGroupUser (state) {
  state.groupUser = null
  localStorage.removeItem(keyGroupUser)
}