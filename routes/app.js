const path = require("path");
const appPath = path.join(__dirname, "../app");
const auth = require("./auth.js");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("data/db_users.sqlite");

db.serialize(function () {
  // ensure that a table of grids exists with the following columns:
  // gridid, gridjson, userid
  let sqlString =
    "CREATE TABLE IF NOT EXISTS grids (gridname TEXT PRIMARY KEY, gridjson TEXT, userid TEXT)";
  db.run(sqlString);
});

exports.home = function (request, response) {
  if (request.session.loggedin) {
    response.render(appPath + "/views/home.hbs", {
      username: request.session.username
    })
  } else {
    console.log("User not logged in.")
    auth.loginPage(request, response);
  }
}

exports.appFiles = function (request, response) {
  if (request.session.loggedin) {
    response.render(appPath + request.url)
  } else {
    console.log("User not logged in.")
    auth.loginPage(request, response);
  }
}

// get grids by a user
exports.getGrids = function (request, response) {
  if (request.session.loggedin) {
    let username = request.session.username;

    db.get("SELECT * FROM users WHERE userid = ?", [username], function (err, row) {
      if (err) console.log(err);

      if (!row) {
        response.redirect("/login");
      }

      if (row.role == "admin") {
        db.all("SELECT * FROM grids", function (err, rows) {
          if (err) console.log(err);

          if (rows) {
            response.send(rows);
          } else {
            response.send("No grids found.");
          }
        });
      } else {
        db.all(
          "SELECT * FROM grids WHERE userid = ?",
          [username],
          function (err, rows) {
            if (err) console.log(err);
    
            if (rows) {
              response.send(rows);
            } else {
              response.send("No grids found for user " + username);
            }
          }
        );
      }
    });

    
  }
}

exports.saveGrid = function (request, response) {
  if (request.session.loggedin) {
    let username = request.session.username;
    let gridjson = request.body.gridjson;
    let gridname = request.body.gridname;

    // overwrite grid if it already exists
    db.run(
      "INSERT OR REPLACE INTO grids VALUES (?, ?, ?)",
      [gridname, gridjson, username],
      function (err) {
        if (err) console.log(err);
        response.send("Grid saved successfully.");
      }
    );
  } else {
    console.log("User not logged in.")
    response.redirect("/login");
  }
}