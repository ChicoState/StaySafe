const express = require("express");
const cors = require("cors");   // Package for handling CORS security
const app = express()
const hostname = "localhost";
const port = 8080;

app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello StaySafe")
});

// set node to listen on localhost:8080
app.listen(port, () => {
  console.log(`Running at http://${hostname}:${port}/`);
});