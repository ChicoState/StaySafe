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
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const browser = await puppeteer.launch({
                defaultViewport: null,
                executablePath: '/usr/bin/google-chrome',
                args: ['--no-sandbox'],
            });
            const page = await browser.newPage();
            await page.goto("https://chico.crimegraphics.com/2013/",
                {
                    waitUntil: 'domcontentloaded'
                }
            );
    
            await page.locator("#ArrestsMenu").click();
            await page.waitForSelector("#gvArrests_ob_gvArrestsMainContainer");
    
            const data = await scrapeData(page);
            await browser.close();
    
            return data;
        } catch (error) {
            console.error(`Error launching browser: ${error.message}`);
            retryCount++;
            console.log("Restarting browser...")
        } 
    } 

    console.error('Failed to launch browser after multiple retries.');
}
