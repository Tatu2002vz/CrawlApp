const { Server } = require("socket.io");
var amqp = require("amqplib");
const {instrument} = require('@socket.io/admin-ui')

const { receiveMsg } = require("../controllers/receiveMsg");
const { getChannel, connect } = require("../../config/rabbitmq");
let data = {};
const socketModule = async (server) => {
  const io = new Server(server, {
    cors: {
      credentials: true,
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });
  instrument(io, {
    auth: false
  });
  await connect();
  io.on("connection", async (socket) => {
    data.id = socket.id;
    console.log(socket.id);
    console.log(io.sockets.sockets.size);
    const channel = getChannel();
    const nameQueue = "message";
    await channel.assertQueue(nameQueue, {
      durable: false, // khi restart thì sẽ mất / không mất msg
    });

    socket.on("active", async () => {
      try {
        await receiveMsg(nameQueue, io);
      } catch (e) {
        console.error(e);
      }
      // try {
      //   const channel = await connMQ.createChannel();
      //   const nameQueue = "message";
      //   await channel.assertQueue(nameQueue, {
      //     durable: false, // khi restart thì sẽ mất / không mất msg
      //   });
      //   receiveQueue(socket, channel, nameQueue)
      //   scrape(channel, nameQueue);
      //   connMQ.close();
      // } catch (error) {
      //   console.log("Lỗi ở socket: " + error.message);
      // }
      // socket.emit("result", {
      //   success: true,
      //   textlog: "Navigating....",
      //   image: "https://vnp.1cdn.vn/2023/01/19/anh-meo-6(1).jpeg",
      //   product: {
      //     name: "name",
      //     price: "price",
      //     image: "image",
      //     description: "description",
      //     link: "link",
      //   },
      // });
      // socket.emit("result", {
      //   success: true,
      //   textlog: "Navigating....",
      //   image: "https://vnp.1cdn.vn/2023/01/19/anh-meo-6(1).jpeg",
      //   product: {
      //     name: "name",
      //     price: "price",
      //     image: "image",
      //     description: "description",
      //     link: "link",
      //   },
      // });
    });

    socket.on("disconnect", () => {
      console.log("ngắt kết nối: " + socket.id);
      console.log(io.sockets.sockets.size);
    });
  });
};
function getId() {
  // if (!data) {
  //   console.log("Không có data");
  // }
  console.log("id: " + data.id);
  return data.id;
}

module.exports = {
  socketModule,
  getId,
};
