// Purpose: scrape the arrest records of Chico.
import puppeteer from 'puppeteer';

// NOTE: Helps us locate data in what page we are in visually in headless mode.
// For Debugging: 
// await page.screenshot({
//     path: 'first.png',
// });

export async function scrapeData(page) {
    const data = await page.$$eval('#gvArrests_ob_gvArrestsMainContainer .ob_gCc1', elements =>
        elements.map(el => el.innerText.trim()).filter(text => text)
    );
    return data
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

    await page.locator("#ArrestsMenu").click();
    await page.waitForNavigation(),
    await page.waitForSelector("#gvArrests_ob_gvArrestsMainContainer");

    const data = await scrapeData(page);
    await browser.close();

    return data;
}
