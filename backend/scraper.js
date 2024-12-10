import puppeteer from "puppeteer";
import axios from "axios";

// Function to scrape and clean addresses labeled as 'Label18' on the website
export async function scrapeData(page) {
    const data = await page.$$eval('span[id$="Label18"]', (elements) =>
        elements
            .map((el) => {
                const text = el.innerText.trim(); // Get text and trim whitespace
                if (text && !text.startsWith("Inc #")) {
                    // Normalize address: Add ", Chico" if not already present
                    return text.endsWith(", Chico") ? text : `${text}, Chico`;
                }
                return null; // Exclude unwanted entries like "Inc #"
            })
            .filter(Boolean) // Remove null values
    );
    return data;
}


// Function to perform geocoding on the addresses
async function geocodeAddress(address) {
    const apiKey = process.env.GMAPS_API_KEY;

    if (!apiKey) {
        throw new Error("Google Maps API Key is missing. Check your .env file.");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            const result = response.data.results[0];
            const location = result.geometry.location;
            return {
                address: result.formatted_address,
                latitude: location.lat,
                longitude: location.lng,
            };
        } else {
            console.error(`Geocoding error for ${address}: ${response.data.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching geocode data for ${address}:`, error);
        return null;
    }
}

// Main function to scrape and geocode data
export async function getData() {
    const maxRetries = 3;
    let retryCount = 0;
    let browser;

    while (retryCount < maxRetries) {
        try {
            browser = await puppeteer.launch({
                defaultViewport: null,
                executablePath: "/usr/bin/google-chrome",
                args: ["--no-sandbox"],
            });

            const page = await browser.newPage();
            await page.goto("https://chico.crimegraphics.com/2013/", {
                waitUntil: "domcontentloaded",
            });

            console.log("Navigating to arrests menu...");
            await page.locator("#ArrestsMenu").click();
            await page.waitForSelector("#gvArrests_ob_gvArrestsMainContainer");

            const addresses = await scrapeData(page);
            console.log("Scraped addresses:", addresses);
            await browser.close();

            // Perform geocoding for each address
            console.log("Performing geocoding...");
            const geocodedData = await Promise.all(
                addresses.map(async (address) => {
                    const geocodeResult = await geocodeAddress(address);
                    if (geocodeResult) {
                        return {
                            originalAddress: address,
                            ...geocodeResult,
                        };
                    }
                    console.error(`Failed to geocode address: ${address}`);
                    return { originalAddress: address, error: "Failed to geocode" };
                })
            );

            return geocodedData;
        } catch (error) {
            console.error(`Error launching browser: ${error.message}`);
            retryCount++;
            console.log("Retrying browser launch...");
        } finally {
            if (browser) await browser.close();
        }
    }

    console.error("Failed to launch browser after multiple retries.");
    return [];
}
