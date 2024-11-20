//scraper.js
// Purpose: scrape the arrest records of Chico.
import puppeteer from 'puppeteer';

// NOTE: Helps us locate data in what page we are in visually in headless mode.
// For Debugging: 
// await page.screenshot({
//     path: 'first.png',
// });

//for testing go to http://localhost:8080/scrape-chico.. (takes while to fetch the data from the chico website so be patient)
// Function to scrape and clean addresses labeled as 'Label18' on the website
export async function scrapeData(page) {
    const data = await page.$$eval('span[id$="Label18"]', elements =>
        elements
            .map(el => el.innerText.trim()) // Get text and trim whitespace
            .filter(text => 
                text && !text.startsWith("Inc #") // Exclude unwanted entries like "Inc #"
            )
    );
    return data;
}

export async function getData() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto("https://chico.crimegraphics.com/2013/default.aspx");

    // Navigate to the arrests section by simulatingn the clicking of the 'Arrest' button
    await page.locator("#ArrestsMenu").click();
    await page.waitForNavigation();
    await page.waitForSelector("#gvArrests_ob_gvArrestsMainContainer");

    // Scrape and clean data for addresses labeled 'Label18'
    const data = await scrapeData(page);
    await browser.close();

    return data;
}
