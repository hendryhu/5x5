const http = require("http");

// API request for a random colour palette
// The service will be down for 30 seconds at +8 UTC while the new models are loaded into memory.
exports.colour = function (request, response) {
  let data = { model: "default" };
  let palette = "";

  let options = {
    method: "POST",
    host: "colormind.io",
    path: "/api/",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let req = http.request(options, function (apiResponse) {
    apiResponse.on("data", function (chunk) {
      palette += chunk;
    });
    apiResponse.on("end", function () {
      response.contentType("application/json").json(JSON.parse(palette));
    });
  });

  req.write(JSON.stringify(data));
  req.end();
};