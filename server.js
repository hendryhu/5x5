const express = require("express");
const session = require("express-session");
const path = require("path");
const favicon = require("serve-favicon");
const http = require("http");

const app = express();
const routes = require(path.join(__dirname, "/routes/index.js"));
const indexAliases = ["/index.html", "/", "/index", "/home", ""];
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// set up the session
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));

// use handlbars for templating
app.set('view engine', 'hbs');
app.set('views', __dirname + '/app/views');

// set up the routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, "/static", "favicon.ico")));

app.get("/register", routes.auth.registrationPage);
app.post("/registerUser", routes.auth.register);
app.get("/login", routes.auth.loginPage);
app.post("/auth", routes.auth.authenticate);
app.post("/logout", routes.auth.logout);
app.get("/users", routes.auth.users);

app.get(indexAliases, routes.appRoutes.home);
app.get("/colour", routes.api.colour);
app.post("/save", routes.appRoutes.saveGrid);
app.get("/getGrids", routes.appRoutes.getGrids);

app.use(express.static(path.join(__dirname, "/static")));

app.use(function (request, response, next) {
  if (request.session.loggedin) {
    express.static(path.join(__dirname, "/app"))(request, response, next);
  } else {
    routes.auth.loginPage(request, response);
  }
});

// start the server
server.listen(port, err => {
  if (err) console.log(err);
  else {
    console.log(`Server listening on port: ${port}`);
    console.log(`To test, go to http://localhost:${port}`);
  }
});

