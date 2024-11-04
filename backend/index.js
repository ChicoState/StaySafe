import express from "express";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv"
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const hostname = "localhost";
const port = 8080;
const fbiAPIKey = process.env.fbiAPIKey

app.use(cors());
app.use(bodyParser.json());

// Temporary storage for search input
let lastSearch = {};

// Start up the localhost server by listening on localhost:8080
app.listen(port, () => {
  console.log(`Running at http://${hostname}:${port}/`);
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

const dbName = "staysafe";
async function connectToDatabase() {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_INITDB_USERNAME}:${process.env.MONGO_INITDB_PASSWORD}@cluster0.bx6ne.mongodb.net/${dbName}`);
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();

const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// NOTE: Mongoose automatically looks for the plural, lowercased version of 
// your collectionName variable.
const collectionName = "users"; 
const userModel = mongoose.model(collectionName, userSchema) 


async function doesEmailExist(email) {
  try {
    const existingUser = await userModel.findOne({ email });
    return existingUser !== null;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}


async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}


// Register route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const emailExists = await doesEmailExist(email);
    if (emailExists) {
      return res.status(401).json({ success: false, message: "Email already exists." });
    }

    const hashedPassword = await hashPassword(password);
    await userModel.create({ name: name, email: email, password: hashedPassword});
    
    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
  }
});

async function doesUserExist(email, password) {
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return false;
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    return isPasswordValid;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
}


// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await doesUserExist(email, password);
    if (userExists) {
      res.json({ success: true, message: "Login successful!" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
  }
});
