const express = require("express");
const cors = require("cors");   // Package for handling CORS security
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const bcrypt = require('bcrypt')
const app = express();
const hostname = "localhost";
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

// Mock database (replace this with a real database later)
const users = [];

app.get('/', (req, res) => {
  res.send("Hello StaySafe")
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = users.find(u => u.email === email);

  if (user) {
    // Compare the password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ success: true, name: user.name, email: user.email });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } else {
    // This message will be returned when the user is not found
    res.status(404).json({ success: false, message: "User not found. Please register first." });
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists by email
  const userExists = users.find(u => u.email === email);

  if (userExists) {
    res.status(400).json({ success: false, message: "User already exists" });
  } else {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the new user in the mock database
    users.push({ name, email, password: hashedPassword });

    // Return a success response
    res.json({ success: true, name, email });
  }
});

// set node to listen on localhost:8080
app.listen(port, () => {
  console.log(`Running at http://${hostname}:${port}/`);
});
