function logout(e) {
  e.preventDefault();
  let request = new XMLHttpRequest();
  request.open("POST", "/logout", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    if (request.status == 200) {
      window.location.href = "/login";
    } else {
      alert("Error logging out!");
    }
  };
}