const puppeteer = require('puppeteer');

async function startBrowser(){
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            headless: 'shell',
            args: ["--disable-setuid-sandbox", "--no-sandbox"],
            'ignoreHTTPSErrors': true,
            "slowMo": 50,
            // executablePath: '/usr/bin/chromium-browser'
        });
        
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};
