import express from "express";
const app = express();

import cors from "cors";   // Package for handling CORS security
import bodyParser from "body-parser"; // Middleware to parse incoming request bodies
import bcrypt from "bcrypt";
app.use(cors());
app.use(bodyParser.json());

import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

// Start up the localhost server by listening on localhost:8080
const hostname = "localhost";
const port = 8080;
app.listen(port, () => {
  console.log(`Running at http://${hostname}:${port}/`);
});


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
