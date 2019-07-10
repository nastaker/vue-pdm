const keyGroupUser = 'groupUser'

export function getGroupUser (state) {
  if (state[keyGroupUser] == null) {
    // user: {token:"djaklfdjiofwms", key1: "value1", key2: "value2" }
    state[keyGroupUser] = JSON.parse(localStorage.getItem(keyGroupUser))
  }
  return state[keyGroupUser]
}