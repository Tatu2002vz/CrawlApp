var amqp = require("amqplib");
const scrape = require("../../scraper/index");
const { getChannel, connect } = require("../../config/rabbitmq");
const {stopCrawl} = require('../../scraper/pageController')
const receiveScraper = async () => {
  //   const connMQ = await amqp.connect("amqp://localhost");
  await connect();
  const channel = getChannel();
  const nameQueue = "scraper";
  await channel.assertQueue(nameQueue, {
    durable: false, // khi restart thì sẽ mất / không mất msg
  });
  console.log("Đang lắng nghe...");
  await channel.consume(
    nameQueue,
    async (msg) => {
      const { id, workerId, type, browser } = JSON.parse(msg.content.toString());
      if(type === 'stop') {
        console.log('stop crawl')
        await stopCrawl({browser, id, workerId});
      } else 
      await scrape({ id, workerId });
    },
    {
      noAck: true,
    }
  );
};
receiveScraper();
