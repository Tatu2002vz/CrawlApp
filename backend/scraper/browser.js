const puppeteer = require('puppeteer');

async function startBrowser(id){
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            headless: 'shell',
            args: ["--disable-setuid-sandbox", "--no-sandbox"],
            'ignoreHTTPSErrors': true,
            executablePath: '/usr/bin/chromium-browser'
        });
        
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};
