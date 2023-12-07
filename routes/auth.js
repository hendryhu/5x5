const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const appPath = path.join(__dirname, "../app");

let db = new sqlite3.Database("data/db_users.sqlite");

db.serialize(function () {
  // ensure that a table of users exists
  let sqlString =
    "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT, role TEXT)";
  db.run(sqlString);

  // check if any user with admin role exists
  db.get("SELECT * FROM users WHERE role = 'admin'", function (err, row) {
    if (err) console.log(err);

    // if no user with admin role exists, insert one
    if (!row) {
      sqlString =
        "INSERT OR REPLACE INTO users VALUES ('admin', 'secret', 'admin')";

      db.run(sqlString, function (err) {
        if (err) console.log(err);
      });
    }
  });
});

// authenticate a user
exports.authenticate = function (request, response) {
  let username = request.body.username;
  let password = request.body.password;

  if (username && password) {
    db.get(
      "SELECT * FROM users WHERE userid = ? AND password = ?",
      [username, password],
      function (err, row) {
        if (err) console.log(err);

        if (row) {
          request.session.loggedin = true;
          request.session.username = username;
          request.session.role = row.role;
          console.log("User " + username + " logged in.");
          response.redirect("/");
        } else {
          // send 401 Unauthorized
          response.status(401).send("Incorrect Username and/or Password!");
        }
      }
    );
  }
};

// serve the registration page
exports.registrationPage = function (request, response) {
  if (request.session.loggedin) {
    response.redirect("/");
  } else {
    response.render(path.join(__dirname, "../static/registration", "registration"));
  }
}

// register a user
exports.register = function (request, response) {
  let username = request.body.username;
  let password = request.body.password;
  
  if (username && password) {
    // check if user already exists
    db.get(
      "SELECT * FROM users WHERE userid = ?",
      [username],
      function (err, row) {
        if (err) console.log(err);

        if (row) {
          response.status(400).send("User already exists.");
        } else {
          // insert user into database
          let sqlString =
            "INSERT OR REPLACE INTO users VALUES (?, ?, 'guest')";

          db.run(sqlString, [username, password], function (err) {
            if (err) console.log(err);
            else {
              console.log("User " + username + " registered.");
              response.redirect("/login");
            }
          });
        }
      }
    );
  } else {
    response.status(400).send("Username and password required.");
  }
}

// serve the login page
exports.loginPage = function (request, response) {
  if (request.session.loggedin) {
    response.redirect("/");
  } else {
    response.render(path.join(__dirname, "../static/login", "login"));
  }
};

// log a user out
exports.logout = function (request, response) {
  console.log("User " + request.session.username + " logged out.");
  request.session.destroy();
  response.render(path.join(__dirname, "../static/login", "login"));
};

// FOR ADMIN USE ONLY: get a list of all users and their roles
exports.users = function (request, response) {
  if (!request.session.loggedin) {
    response.redirect("/login");
  } else {
    // check if user is admin
    let username = request.session.username;
    db.get(
      "SELECT * FROM users WHERE userid = ?",
      [username],
      function (err, row) {
        if (err) console.log(err);
        else if (!row) response.redirect("/login");
        else if (row.role != "admin") response.redirect("/login");
        else {
          console.log("User " + username + " is admin.");

          // get a list of all users and their roles
          db.all("SELECT userid, role FROM users", function (err, rows) {
            if (err) console.log(err);

            if (rows) {
              let users = [];

              for (let i = 0; i < rows.length; i++) {
                users.push(rows[i].userid + " - " + rows[i].role)
              }

              console.log(users);

              response.render(appPath + "/views/users.hbs",
                {
                  userEntries: rows
                });
            } else {
              response.send("No users found.");
            }
          });
        }
      }
    );
  }
};
