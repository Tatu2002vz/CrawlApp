const Worker = require("../models/worker");
const Textlog = require("../models/textlog");
var amqp = require("amqplib");

const activeBot = async (req, res) => {
  const connMQ = await amqp.connect("amqp://localhost");
  const { id } = req.body;
  try {
    const channel = await connMQ.createChannel();
    const nameQueue = "scraper";
    await channel.assertQueue(nameQueue, {
      durable: false, // khi restart thì sẽ mất / không mất msg
    });
    const worker = await Worker.create({ sucess: 0 });
    if (!worker) return res.json("error");
    await channel.sendToQueue(
      nameQueue,
      Buffer.from(JSON.stringify({ id: id.toString(), workerId: worker._id }))
    );
    return res.json("success");
  } catch (error) {
    console.log("Lỗi ở controller active bot: " + error.message);
  }
  // const {name, price, image, description, link, workerId} = data;
};

const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort("-updatedAt");
    return res.status(200).json({ mes: workers });
  } catch (e) {
    console.log("Lỗi ở get all workers");
    throw new Error("Lỗi ở get all workers" + e.message);
  }
};

const getDetailWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id);
    if (worker) {
      const textlog = await Textlog.find({ workerId: worker._id });
      if (textlog) {
        return res.status(200).json({
          mes: textlog,
        });
      } else {
        return res.status(400).json({mes: 'error'})
      }
    } else {
      throw new Error("Có lỗi xảy ra!");
    }
  } catch (e) {
    throw new Error("Lỗi ở lấy chi tiết worker" + e.message);
  }
};

module.exports = {
  activeBot,
  getAllWorkers,
  getDetailWorker,
};
