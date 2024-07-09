var amqp = require("amqplib");
const scrape = require("../../scraper/index");
const { getChannel, connect } = require("../../config/rabbitmq");

const receiveScraper = async () => {
  //   const connMQ = await amqp.connect("amqp://localhost");
  await connect();
  const channel = getChannel();
  const nameQueue = "scraper";
  await channel.assertQueue(nameQueue, {
    durable: false, // khi restart thì sẽ mất / không mất msg
  });
  await channel.prefetch(1);
  console.log("Đang lắng nghe...");
  await channel.consume(
    nameQueue,
    async (msg) => {
      const {id, workerId} = JSON.parse(msg.content.toString())
      console.log(id, workerId)
      await scrape({id, workerId});
    },
    {
      noAck: true,
    }
  );
};
receiveScraper();
