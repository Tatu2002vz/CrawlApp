// rabbitmq.js
const amqp = require("amqplib");

let channel = null;

async function connect() {
  try {
    let nameQueue = "message";
    const connection = await amqp.connect("amqp://localhost"); // URL của RabbitMQ server
    channel = await connection.createChannel();
    await channel.assertQueue(nameQueue, {
      durable: false, // khi restart thì sẽ mất / không mất msg
    });
    await channel.prefetch(1);

    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
}

function getChannel() {
  if (!channel) {
    throw new Error("Channel is not created. Call connect() first.");
  }
  return channel;
}

module.exports = { connect, getChannel };
