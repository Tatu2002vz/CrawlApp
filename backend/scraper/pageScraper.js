const path = require("path");
const fs = require("fs");
const { getChannel } = require("../config/rabbitmq");

const scraperObject = {
  scrapCategory: (browser, url, channel, nameQueue, id, workerId) =>
    new Promise(async (resolve, reject) => {
      try {


        let page = await browser.newPage();
        await page.setViewport({ width: 1500, height: 1500 });
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Chuyển hướng tới ${url}...`,
            })
          )
        );
        await page.goto(url);
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Đã truy cập vào ${url}`,
            })
          )
        );

        await page.waitForSelector("#navbar");
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Đã load xong website ${url}`,
            })
          )
        );

        
        // Chụp ảnh trang chủ
        await channel.sendToQueue( 
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Chụp ảnh màn hình trang ${url}`,
            })
          )
        );

        const base64 = await page.screenshot({encoding: 'base64'});
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "imageReview",
              data: base64,
            })
          )
        );
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Lấy danh sách danh mục...`,
            })
          )
        );

        // const optionText = await page.$eval("#searchDropdownBox", (select) => {
        //   const option = select.querySelector(
        //     'option[value="search-alias=arts-crafts-intl-ship"]'
        //   );
        //   option.selected = true;
        //   const event = new Event("change", { bubbles: true });
        //   select.dispatchEvent(event);
        //   return option.innerText;
        // });

        const category = await page.$$eval(
          "#navbar > ul.dropdown-menu.list-cat > li",
          (els) => {
            return els.map((el) => {
              return {
                name: el.querySelector("a").textContent,
                link: el.querySelector("a").href,
              };
            });
          }
        );
        await page.close();
        resolve(category);
      } catch (error) {
        console.log(error.message);
        console.log(nameQueue);
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "error",
              data: `Lỗi khi lấy danh mục: ${error.message}`,
            })
          )
        );
        reject(error.message);
      }
    }),
  scapePageNumber: (browser, url, channel, nameQueue, id, workerId) =>
    new Promise(async (resolve, reject) => {
      try {
        channel = getChannel();
        nameQueue = "message";
        let page = await browser.newPage();
        await page.setViewport({ width: 1500, height: 1500 });
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Chuyển hướng tới ${url}`,
            })
          )
        );

        await page.goto(url);
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Đã truy cập vào ${url}`,
            })
          )
        );
        await page.waitForSelector(".container");
        await page.waitForSelector(".site-bar-right");
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Đã load xong website ${url}`,
            })
          )
        );

        
        // Chụp ảnh trang chủ
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Chụp ảnh màn hình trang ${url}`,
            })
          )
        );

        
        const base64 = await page.screenshot({encoding: 'base64'});
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "imageReview",
              data: base64,
            })
          )
        );

        const numberPage = await page.$$eval(
          ".pagination-box ul.pagination > li",
          (els) => {
            // return els;
            return els[els.length - 2].querySelector("a").textContent;
          }
        );
        await page.close();
        resolve(numberPage);
      } catch (error) {
        console.log(error.message);
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "error",
              data: `Lỗi khi lấy danh sách trang: ${error.message}`,
            })
          )
        );
        reject(error);
      }
    }),
  scapeProduct: (browser, url, channel, nameQueue, id, workerId) =>
    new Promise(async (resolve, reject) => {
      try {
        channel = getChannel();
        nameQueue = "message";
        let page = await browser.newPage();
        await page.setViewport({ width: 1500, height: 1500 });
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Chuyển hướng tới ${url}`,
            })
          )
        );

        await page.goto(url);
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Đã truy cập vào ${url}`,
            })
          )
        );
        await page.waitForSelector(".container");
        await page.waitForSelector(".site-bar-right");
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Đã load xong website ${url}`,
            })
          )
        );

        
        // Chụp ảnh trang chủ
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Chụp ảnh màn hình trang ${url}`,
            })
          )
        );

        
        const base64 = await page.screenshot({encoding: 'base64'});

        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "imageReview",
              data: base64,
            })
          )
        );
        const product = await page.$$eval(
          ".list-product-contain > .product-item.ids-get-pos",
          (els) => {
            return els.map((el) => {
              return {
                name: el.querySelector("h3.product-title > a").textContent,
                link: el.querySelector("h3.product-title > a").href,
              };
            });
          }
        );
        await page.close();
        resolve(product);
      } catch (error) {
        console.log(error.message);
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "error",
              data: `Lỗi khi lấy danh sách sản phẩm trên trang: ${error.message}`,
            })
          )
        );
        reject(error);
      }
    }),
  scapeDetailProduct: (browser, url, channel, nameQueue, id, workerId) =>
    new Promise(async (resolve, reject) => {
      try {
        channel = getChannel();
        nameQueue = "message";
        let page = await browser.newPage();
        await page.setViewport({ width: 1500, height: 1500 });

        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Chuyển hướng tới ${url}...`,
            })
          )
        );

        await page.goto(url);
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Đã truy cập vào ${url}`,
            })
          )
        );

        await page.waitForSelector("#main");
        await page.waitForSelector(".product-detail-layout-wrapper");
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Đã load xong website ${url}`,
            })
          )
        );

        
        // Chụp ảnh trang chủ
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Chụp ảnh màn hình trang ${url}`,
            })
          )
        );

        
        const base64 = await page.screenshot({encoding: 'base64'});

        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "imageReview",
              data: base64,
            })
          )
        );

        const product = {};
        const image = await page.$eval("#slider-wrapper", (el) => {
          return el.querySelector("a").href;
        });
        product.image = image;
        const name = await page.$eval(
          ".product-detail-layout-item.product-detail-header",
          (el) => el.querySelector("#js-product-title").textContent
        );
        product.name = name;
        const price = await page.$eval(
          ".product-detail-price-box",
          (el) => el.querySelector("#price-show").textContent
        );
        product.price = price;
        const description = await page.$eval(
          "#product-detail",
          (el) => el.querySelector("#content-product").innerHTML
        );
        product.description = description;
        product.link = url;
        product.createdAt = Date.now();
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "textlog",
              data: `Đã lấy xong thông tin sản phẩm: ${product.name}`,
            })
          )
        );

        await page.close();
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({ id: id,
              workerId: workerId, type: "product", data: product })
          )
        );
        resolve(product);
      } catch (error) {
        await channel.sendToQueue(
          nameQueue,
          Buffer.from(
            JSON.stringify({
              id: id,
              workerId: workerId,
              type: "error",
              data: `Lỗi khi lấy chi tiết sản phẩm: ${error.message} tại link: ${url}`,
            })
          )
        );
        reject(error);
      }
    }),
};

module.exports = scraperObject;
