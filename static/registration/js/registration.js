let usernameField = document.getElementById("username");
let passwordField = document.getElementById("password");
let confirmPasswordField = document.getElementById("confirmPassword");
let registerButton = document.getElementById("registerButton");
let errorField = document.getElementById("errorMessage");

// check if passwords match
function validatePassword() {
  if (passwordField.value != confirmPasswordField.value) {
    errorField.innerHTML = "Passwords do not match!";
    return false;
  } else {
    return true;
  }
}

// make a request to register a user
function registerUser() {
  let username = usernameField.value;
  let password = passwordField.value;

  if (!username || !password || !confirmPasswordField.value) {
    errorField.innerHTML = "Please fill out all fields!";
    return;
  }

  if (!validatePassword()) {
    errorField.innerHTML = "Passwords do not match!";
    return;
  }

  let body = {
    username: username,
    password: password,
  };

  let request = new XMLHttpRequest();
  request.open("POST", "/registerUser", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(body));
  request.onload = function () {
    if (request.status == 200) {
      window.location.href = "/login";
    } else {
      errorField.innerHTML = "Error registering user!";
    }
  };
}

// add event listener to register button
registerButton.addEventListener("click", registerUser);