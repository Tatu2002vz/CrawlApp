const Worker = require("../models/worker");
const Textlog = require("../models/textlog");
const Product = require("../models/product");
var amqp = require("amqplib");
const { getChannel } = require("../../config/rabbitmq");
const activeBot = async (req, res) => {
  // const connMQ = await amqp.connect("amqp://localhost");
  const { id } = req.body;
  try {
    const channel = await getChannel();
    const nameQueue = "scraper";
    await channel.assertQueue(nameQueue, {
      durable: false, // khi restart thì sẽ mất / không mất msg
    });
    const workerExist = await Worker.findOne({ socketId: id });
    if (workerExist && workerExist.active) {
      return res.status(200).json({
        success: false,
        mes: "Bot đang chạy!",
      });
    }

    const worker = await Worker.create({ socketId: id });
    if (!worker) return res.json("error");
    await channel.sendToQueue(
      nameQueue,
      Buffer.from(JSON.stringify({ id: id.toString(), workerId: worker._id }))
    );
    return res.status(200).json({ success: true, mes: worker });
  } catch (error) {
    return res.status(200).json({
      success: false,
      mes: "Bot đã dừng! Vui lòng tải lại trang để khởi động bot mới.",
    });
  }
  // const {name, price, image, description, link, workerId} = data;
};

const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort("-updatedAt");
    return res.status(200).json({ mes: workers });
  } catch (e) {
    console.log("Lỗi ở get all workers: " + e.message);
    throw new Error("Lỗi ở get all workers" + e.message);
  }
};

const getDetailWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id);
    if (worker) {
      const textlog = await Textlog.find({ workerId: worker._id });
      const product = await Product.find({ workerId: worker._id });
      if (textlog) {
        return res.status(200).json({
          mes: { textlog, product },
        });
      } else {
        return res.status(400).json({ mes: "error" });
      }
    } else {
      throw new Error("Có lỗi xảy ra!");
    }
  } catch (e) {
    throw new Error("Lỗi ở lấy chi tiết worker" + e.message);
  }
};
const stopWorker = async (req, res) => {
  const { id, workerId } = req.body;
  try {
    const worker = await Worker.findById(workerId);
    if (!worker.active) {
      return res.status(200).json({ sucess: false, mes: "Bot đã dừng!" });
    }
    const channel = getChannel();
    const nameQueue = "scraper";
    await channel.assertQueue(nameQueue, {
      durable: false, // khi restart thì sẽ mất / không mất msg
    });
    await channel.sendToQueue(
      nameQueue,
      Buffer.from(
        JSON.stringify({
          id,
          workerId,
          type: "stop",
          browser: worker.browser,
        })
      )
    );

    return res.status(200).json({ success: true, mes: "Success" });
  } catch (error) {
    console.log("Lỗi ở controller stop bot: " + error.message);
    return res.status(200).json({ success: false, mes: "Không thấy bot!" });
  }
};

module.exports = {
  activeBot,
  getAllWorkers,
  getDetailWorker,
  stopWorker,
};
