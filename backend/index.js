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
const fbiAPIKey = process.env.FBI_API_KEY
const { Schema } = mongoose;
const dbName = "staysafe";

connectToDatabase();

app.use(cors());
app.use(bodyParser.json());

// Temporary storage for search input
let lastSearch = {};

// Start up the localhost server by listening on localhost:8080
app.listen(port, () => {
  console.log(`Running at http://${hostname}:${port}/`);
});

/* FBI API Functionality */
app.get('/api/fbi/crime-stats', async (req, res) => {
  const crime_types = [
    "aggravated-assault",
    "arson",
    "burglary",
    "larceny",
    "motor-vehicle-theft",
    "property-crime",
    "violent-crime",
    "homicide",
    "rape",
    "robbery",
  ];
  // Make a request for each type of crime and store it
  const results = [];

  try {
    // Get info needed for API call from url params
    const { location, state, county, year, filter } = req.query;
    const ori_results = await getOri(state, county, location);
    const ori_code = ori_results.ori;
    const loc_found = ori_results.loc_found;
    let from_date = `01-${year}`;
    let to_date = `12-${year}`;

    for (let i = 0; i < crime_types.length; i++) {
      let crime_type = crime_types[i];
      let url = `https://api.usa.gov/crime/fbi/cde/summarized/agency/${ori_code}/${crime_type}?year=${year}&from=${from_date}&to=${to_date}&API_KEY=${fbiAPIKey}`;
      const response = await axios.get(url);
      results.push({
        location,
        state,
        county,
        year,
        crime_type,
        loc_found,
        data: response.data,
      });
    }
    if (filter === "rates") {
      const filtered_results = await getRates(results);
      return res.json(filtered_results);
    }
    return res.json(results);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

async function getOri(state, county, location) {
  let url = `https://api.usa.gov/crime/fbi/cde/agency/byStateAbbr/${state}?API_KEY=${fbiAPIKey}`;
  let loc_found = true;
  try {
    const response = await axios.get(url);
    const agencyData = response.data[county.toUpperCase()];
    let agency = agencyData.find(agency =>
      agency.state_abbr.toUpperCase() === state.toUpperCase() &&
      agency.agency_name.toLowerCase().includes(location.toLowerCase()) &&
      agency.agency_type_name === "City" 
    );
    // Fall back to county data if city not found
    if (!agency) {
      console.log("City lookup failed, falling back to county data...")
      agency = agencyData.find(agency =>
        agency.state_abbr.toUpperCase() === state.toUpperCase() &&
        agency.agency_type_name === "County"
      );
      loc_found = false;
    }

    if (agency) {
      return {
        ori: agency.ori,
        loc_found: loc_found,
      }
    }
  }
  catch (error) {
    console.error(error);
  }
  // If no results found
  return { ori: null, found: false };
};

async function getRates(crime_data) {
  let url = "http://localhost:8080/api/fbi/crime-stats";

  try {

    const filteredData = crime_data.map(crime => {
      const rates = crime?.data?.offenses?.rates || {};

      // Filter rates, excluding clearances (resovled cases)
      const filteredRates = Object.fromEntries(
        Object.entries(rates).filter(([key]) => !key.includes("Clearances"))
      );

      return {
        crime_type: crime.crime_type,
        location: crime.location,
        state: crime.state,
        county: crime.county,
        year: crime.year,
        loc_found: crime.loc_found,
        rates: filteredRates,
      };
    });
    return filteredData;
  } 
  catch (error) {
    console.error("Error fetching or processing crime data:", error);
    return [];
  }
}


/* Database functionality */
async function connectToDatabase() {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_INITDB_USERNAME}:${process.env.MONGO_INITDB_PASSWORD}@cluster0.bx6ne.mongodb.net/${dbName}`);
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

/* User creation & handling functionality */
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
    await userModel.create({ name: name, email: email, password: hashedPassword });

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
