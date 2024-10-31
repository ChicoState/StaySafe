require('dotenv').config();
const express = require("express");
const cors = require("cors");   // Package for handling CORS security
const axios = require("axios")
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const bcrypt = require('bcrypt')
const app = express();
const hostname = "localhost";
const port = 8080;
const fbiAPIKey = process.env.fbiAPIKey

app.use(cors());
app.use(bodyParser.json());

// Mock database (replace this with a real database later)
const users = [];
// Temporary storage for search input
let lastSearch = {};

app.get('/', (req, res) => {
  res.send("Hello StaySafe")
});

app.post('/api/search', (req, res) => {
  let { county, location, state } = req.body;
  county = county.replace(/\s[Cc]ounty$/, '');
  lastSearch = { county, location, state };

  console.log('Received data:', lastSearch);
  res.status(200).json({ message: 'Data stored successfully', data: lastSearch });
});

app.get('/api/fetch-info', async (req, res) => {
  try {
    let county = lastSearch.county;
    let state = lastSearch.state;
    let location = lastSearch.location;
    let ori_code = await getOri(state, county, location);
    let crime_type = "property-crime";
    let year = "2023";
    let from_date = `01-${year}`;
    let to_date = `12-${year}`;
    let url = `https://api.usa.gov/crime/fbi/cde/summarized/agency/${ori_code}/${crime_type}?year=${year}&from=${from_date}&to=${to_date}&API_KEY=${fbiAPIKey}`;
    const response = await axios.get(url);
    return res.json(response.data);
  }
  catch (error) {
    console.error(error);
  }
});

async function getOri(state, county, location) {
  let url = `https://api.usa.gov/crime/fbi/cde/agency/byStateAbbr/CA?API_KEY=${fbiAPIKey}`;
  try {
    const response = await axios.get(url);
    const agencyData = response.data[county.toUpperCase()];
    const agency = agencyData.find(agency =>
      agency.state_abbr.toUpperCase() === state.toUpperCase() &&
      agency.agency_name.toLowerCase().includes(location.toLowerCase()) &&
      agency.agency_type_name === "City"
    );

    if (agency) {
      return agency.ori;
    }
  }
  catch (error) {
    console.error(error);
  }
};

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
