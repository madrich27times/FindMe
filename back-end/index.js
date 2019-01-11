var express = require("express");
var home = require('./routes/home.js');
var path = require('path');
var app = express();
app.set('public', __dirname + '/public');
app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
  res.send(
    "<h1>Welcome to the People on the Back-End API!</h1><h3>Enter the number of results you like to receive in the url, like so: /api/results=10</h3><h3>If you'd like to receive the same results every time you call the API, include a seed and format the url like so: /api/results=100/seed=hi</h3>"
  );
});

app.get("/api/results=:results", home.index);

app.get("/api/results=:results/seed=:key", home.index);

app.listen(3000);