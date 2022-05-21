function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() - (1 * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

setCookie('access-token', 0)
window.location.href = "../";