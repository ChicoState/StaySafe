
//this is for scraping data from chico arrests website
//had to stimulate the action of clicking 'close' and then 'arrests' button since it was dyanmically updating the page (no URL change)
// backend/scraper.js


// backend/scraper.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // Enable CORS

// Simplified /scrape-chico route
app.get('/scrape-chico', (req, res) => {
  res.json({ message: 'Scrape Chico route is working!' });
});

// Start the Express server on port 8080
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
