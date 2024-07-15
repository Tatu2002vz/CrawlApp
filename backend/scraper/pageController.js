// ./book-scraper/pageController.js
const pageScraper = require("./pageScraper");
var amqp = require("amqplib");
const { getChannel } = require("../config/rabbitmq");
const { v4: uuidv4 } = require("uuid");

let browsers = [];
async function scrapeAll(browserInstance, id, workerId) {
  let timeStart = new Date().getTime();
  const url = "https://chiaki.vn/";
  try {
    const channel = await getChannel();
    const nameQueue = "message";
    console.log("id: " + id);
    console.log("worker: " + workerId);
    let browser = await browserInstance;

    const browserId = uuidv4();
    browsers.push({ id: browserId, browser: browser, timeStart });
    await channel.sendToQueue(
      nameQueue,
      Buffer.from(
        JSON.stringify({
          id: id,
          workerId: workerId,
          type: "browser",
          data: browserId,
        })
      )
    );
    // await channel.sendToQueue(
    //   nameQueue,
    //   Buffer.from(
    //     JSON.stringify({
    //       id: id,
    //       workerId: workerId,
    //       type: "active",
    //       data: true,
    //     })
    //   )
    // );
    // let count = 0;
    // let countTimer = setInterval(() => {
    //   count++;
    //   if (count >= 60) {
    //     clearInterval(countTimer);
    //   }
    // }, 1000);
    // let returnTimer = setInterval(async () => {
    //   await channel.sendToQueue(
    //     nameQueue,
    //     Buffer.from(
    //       JSON.stringify({
    //         id: id,
    //         workerId: workerId,
    //         type: "speed",
    //         data: count,
    //       })
    //     )
    //   );
    //   if (count >= 60) {
    //     clearInterval(returnTimer);
    //   }
    // }, 5000);
    // setTimeout(async () => {
    //   await channel.sendToQueue(
    //     nameQueue,
    //     Buffer.from(
    //       JSON.stringify({
    //         id: id,
    //         workerId: workerId,
    //         type: "active",
    //         data: false,
    //       })
    //     )
    //   );
    //   await channel.sendToQueue(
    //     nameQueue,
    //     Buffer.from(
    //       JSON.stringify({
    //         id: id,
    //         workerId: workerId,
    //         type: "textlog",
    //         data: "Hết 5 phút. Dừng chương trình!",
    //       })
    //     )
    //   );
    // }, 120000);
    // setTimeout(async() => {
    //   process.exit();
    // }, 121000);
    // -----------
    const categories = await pageScraper.scrapCategory(
      browser,
      url,
      channel,
      nameQueue,
      id,
      workerId
    );
    categories.pop();
    let products = [];
    //------------------------------

    // --------------------
    for (let category of categories) {
      try {
        const pageNumber = await pageScraper.scapePageNumber(
          browser,
          category.link,
          channel,
          nameQueue,
          id,
          workerId
        );
        const arrayPage = [];
        for (let i = 1; i < pageNumber; i++) {
          arrayPage.push(i);
        }
        for (let page of arrayPage) {
          try {
            const products_per_page = await pageScraper.scapeProduct(
              browser,
              `${category.link}?page=${page}`,
              channel,
              nameQueue,
              id,
              workerId
            );
            for (let product of products_per_page) {
              try {
                const detailProduct = await pageScraper.scapeDetailProduct(
                  browser,
                  product.link,
                  channel,
                  nameQueue,
                  id,
                  workerId
                );
                products.push(detailProduct);
              } catch (error) {
                console.log("Lỗi ở lấy chi tiết sp: " + error.message);
                if (error.message.includes("Connection closed")) break;
              }
            }
          } catch (error) {
            console.log(
              "Lỗi xảy ra khi lấy sản phẩm trên 1 trang: " + error.message
            );
            if (error.message.includes("Connection closed")) break;
          }
        }
      } catch (error) {
        console.log(`Có lỗi xảy ra khi lấy số trang: ${error.message}`);
        if (error.message.includes("Connection closed")) break;
      }
    }
    await channel.sendToQueue(
      nameQueue,
      Buffer.from(
        JSON.stringify({
          id: id,
          workerId: workerId,
          type: "active",
          data: false,
        })
      )
    );
    // console.log(products);
  } catch (err) {
    console.log("Có lỗi xảy ra ở page controller: ", err.message);
  }
}
async function stopCrawl({ browser, id, workerId }) {
  // if (browsers.) {
  //   browser.close();
  // }

  let channel = getChannel();
  let nameQueue = "message";
  let timeEnd = new Date().getTime();
  const closeCrawler = browsers.find((item) => item.id === browser);
  if (closeCrawler) {
    const time = (timeEnd - +closeCrawler?.timeStart) / 1000;
    await channel.sendToQueue(
      nameQueue,
      Buffer.from(
        JSON.stringify({
          id: id,
          workerId: workerId,
          type: "active",
          data: false,
        })
      )
    );
    await channel.sendToQueue(
      nameQueue,
      Buffer.from(
        JSON.stringify({
          id: id,
          workerId: workerId,
          type: "speed",
          data: time,
        })
      )
    );
    await channel.sendToQueue(
      nameQueue,
      Buffer.from(
        JSON.stringify({
          id: id,
          workerId: workerId,
          type: "stop",
          data: "Dừng chương trình!",
        })
      )
    );
    await closeCrawler?.browser.close();
  }
}
module.exports = {
  scrapeAll,
  stopCrawl,
};
