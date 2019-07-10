function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

export default function(_this, data) {
  _this.$http.defaults.headers.common['Authorization'] = 'bearer ' + data.token
  _this.$store.commit('user/setUser', data)
  setCookie('loginguid', data.loginguid, 1)
}