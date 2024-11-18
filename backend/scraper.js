//this is for scraping data from chico arrests website
//had to stimulate the action of clicking 'close' and then 'arrests' button since it was dyanmically updating the page (no URL change)
// backend/scraper.js
// backend/scraper.js
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS

// Define the /scrape-chico route
app.get('/scrape-chico', async (req, res) => {
    res.send("Hello its working")
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://chico.crimegraphics.com/2013/default.aspx', { waitUntil: 'networkidle2' });

    // Click the "Close" button to dismiss the warning
    await page.waitForSelector('#CloseButton', { timeout: 5000 });
    await page.click('#CloseButton');

    // Click the "Arrests" button twice to get the arrest data
    await page.waitForSelector('#ArrestsMenu');
    await page.click('#ArrestsMenu');
    await page.waitForTimeout(1000);
    await page.click('#ArrestsMenu');

    // Scrape the addresses
    await page.waitForSelector('#gvArrests_ob_gvArrestsMainContainer');
    const addresses = await page.$$eval('#gvArrests_ob_gvArrestsMainContainer .ob_gCc1', elements =>
      elements.map(el => el.innerText.trim()).filter(text => text)
    );

    await browser.close();
    res.json(addresses); // Send the addresses as JSON
  } catch (error) {
    console.error('Error scraping data:', error);
    if (browser) await browser.close();
    res.status(500).json({ error: 'Error scraping data' });
  }
});



// Start the Express server on port 8080
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
