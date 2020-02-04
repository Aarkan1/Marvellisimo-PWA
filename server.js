const express = require("express");
const port = 3020
const app = express();
app.use(express.static(__dirname + "/"));
app.get('*', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.listen(port);
console.log("listening on port", port);