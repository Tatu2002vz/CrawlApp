const browserObject = require("./browser");
const scraperController = require("./pageController");
const scrape = async ({id, workerId}) => {
  try {
    let browserInstance = browserObject.startBrowser();
    scraperController(browserInstance, id, workerId);
  } catch (e) {
    console.log('Lỗi scraper: ' + e.message);
  }
  //Start the browser and create a browser instance

  // Pass the browser instance to the scraper controller
};
// scrape()
module.exports = scrape;
