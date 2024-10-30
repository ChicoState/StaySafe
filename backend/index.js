// const express = require("express");
// const cors = require("cors");   // Package for handling CORS security
// const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
// const bcrypt = require('bcrypt')
// const app = express();
// const hostname = "localhost";
// const port = 8080;

// app.use(cors());
// app.use(bodyParser.json());

// // Mock database (replace this with a real database later)
// const users = [];

// app.get('/', (req, res) => {
//   res.send("Hello StaySafe")
// });

// // Login route
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Find the user by email
//   const user = users.find(u => u.email === email);

//   if (user) {
//     // Compare the password with the hashed password
//     const match = await bcrypt.compare(password, user.password);
//     if (match) {
//       res.json({ success: true, name: user.name, email: user.email });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } else {
//     // This message will be returned when the user is not found
//     res.status(404).json({ success: false, message: "User not found. Please register first." });
//   }
// });

// // Register route
// app.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   // Check if the user already exists by email
//   const userExists = users.find(u => u.email === email);

//   if (userExists) {
//     res.status(400).json({ success: false, message: "User already exists" });
//   } else {
//     // Hash the password before storing it
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Store the new user in the mock database
//     users.push({ name, email, password: hashedPassword });

//     // Return a success response
//     res.json({ success: true, name, email });
//   }
// });

// // set node to listen on localhost:8080
// app.listen(port, () => {
//   console.log(`Running at http://${hostname}:${port}/`);
// });

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

async function connectToDatabase() {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_INITDB_USERNAME}:${process.env.MONGO_INITDB_PASSWORD}@cluster0.bx6ne.mongodb.net/ --apiVersion 1`);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

// // Schema for users of app
// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//     },
// });
// const User = mongoose.model('users', UserSchema);
// User.createIndexes();

// // For backend and express
// const express = require('express');
// const app = express();
// const cors = require("cors");
// console.log("App listen at port 5000");
// app.use(express.json());
// app.use(cors());
// app.get("/", (req, resp) => {

//     resp.send("App is Working");
//     // You can check backend is working or not by 
//     // entering http://loacalhost:5000
    
//     // If you see App is working means
//     // backend working properly
// });

// app.post("/register", async (req, resp) => {
//     try {
//         const user = new User(req.body);
//         let result = await user.save();
//         result = result.toObject();
//         if (result) {
//             delete result.password;
//             resp.send(req.body);
//             console.log(result);
//         } else {
//             console.log("User already register");
//         }

//     } catch (e) {
//         resp.send("Something Went Wrong");
//     }
// });
// app.listen(8080)