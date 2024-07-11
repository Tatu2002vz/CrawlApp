// ./book-scraper/pageController.js
const pageScraper = require("./pageScraper");
var amqp = require("amqplib");
const { getChannel } = require("../config/rabbitmq");
const browsers = require("../src/controllers/receiveScraper");

const { v4: uuidv4 } = require("uuid");
let browser;
async function scrapeAll(browserInstance, id, workerId) {
  const url = "https://chiaki.vn/";
  try {
    const channel = await getChannel();
    const nameQueue = "message";
    console.log("id: " + id);
    console.log("worker: " + workerId);
    browser = await browserInstance;

    await channel.sendToQueue(
      nameQueue,
      Buffer.from(
        JSON.stringify({
          id: id,
          workerId: workerId,
          type: "BBCXS",
          data: `Chụp ảnh màn hình trang ${url}`,
        })
      )
    );

    const browserId = uuidv4();
    Array.from(browsers).push({ id: browserId, browser: browser });
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
    await channel.sendToQueue(
      nameQueue,
      Buffer.from(
        JSON.stringify({
          id: id,
          workerId: workerId,
          type: "active",
          data: true,
        })
      )
    );
    let count = 0;
    let countTimer = setInterval(() => {
      count++;
      if (count >= 60) {
        clearInterval(countTimer);
      }
    }, 1000);
    let returnTimer = setInterval(async () => {
      await channel.sendToQueue(
        nameQueue,
        Buffer.from(
          JSON.stringify({
            id: id,
            workerId: workerId,
            type: "speed",
            data: count,
          })
        )
      );
      if (count >= 60) {
        clearInterval(returnTimer);
      }
    }, 5000);
    setTimeout(async () => {
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
      await browser.close();
    }, 60000);
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
    // try {
    //   const conn = await amqp.connect("amqp://localhost");
    //   const channel = await conn.createChannel();
    //   // create exchange
    //   const nameExchange = "product";
    //   await channel.assertExchange(nameExchange, "fanout", {
    //     durable: false,
    //   });
    //   const { queue } = await channel.assertQueue("", {
    //     exclusive: true, // tự động xóa khi close connect
    //   });
    //   console.log(`namequeue: ${queue}`);
    //   // 5.
    //   await channel.bindQueue(queue, nameExchange, "");
    //   await channel.consume(
    //     queue,
    //     async (msg) => {
    //       const link = msg.content.toString();
    //       console.log(`msg: ${msg.content.toString()}`);
    //       const detailProducts = await pageScraper.scapeDetailProduct(
    //         browser,
    //         link,
    //         socket
    //       );
    //     },
    //     {
    //       noAck: true,
    //     }
    //   );
    //   // 4. publish video
    //   await channel.publish(
    //     nameExchange,
    //     "",
    //     Buffer.from(
    //       "https://chiaki.vn/collagen-mang-cut-dau-biec-zenpali-hop-30-goi"
    //     )
    //   );
    //   console.log(
    //     `[x] Send Ok:::https://chiaki.vn/collagen-mang-cut-dau-biec-zenpali-hop-30-goi`
    //   );
    //   // setTimeout(function() {
    //   //     conn.close()
    //   //     process.exit(0);
    //   // }, 2000)

    // } catch (error) {
    //   console.log(error);
    // }

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
              } catch (error) {}
            }
          } catch (error) {
            console.log(error);
            continue;
          }
        }
      } catch (error) {
        console.log(`Có lỗi xảy ra: ${error}`);
        continue;
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
    console.log("Có lỗi xảy ra ở page controller: ", err);
  }
}
async function stopCrawl(id) {
  // if (browsers.) {
  //   browser.close();
  // }
  
  console.log('browsers: ' + Array.from(browsers))
  const closeCrawler = Array.from(browsers).find((item) => item.id === id);
  closeCrawler?.close();
}
module.exports = {
  scrapeAll,
  stopCrawl,
};
