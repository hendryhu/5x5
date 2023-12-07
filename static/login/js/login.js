function authenticate(e) {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let body = {
    username: username,
    password: password,
  };
  
  if (username && password) {
    let request = new XMLHttpRequest();
    request.open("POST", "/auth", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(body));
    request.onload = function () {
      if (request.status == 200) {
        window.location.href = "/";
      } else {
        alert("Incorrect Username and/or Password!");
      }
    };
  }
}

// add event listener to login button
document.getElementById("loginButton").addEventListener("click", authenticate);