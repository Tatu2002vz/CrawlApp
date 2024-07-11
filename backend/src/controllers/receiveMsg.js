// xử lí sk
const { getChannel } = require("../../config/rabbitmq");
const _ = require("lodash");
const Product = require("../models/product");
const Textlog = require("../models/textlog");
const Worker = require("../models/worker");
const receiveMsg = async (nameQueue, io) => {
  const channel = getChannel();
  await channel.consume(
    nameQueue,
    async (msg) => {
      // delete (JSON.parse(msg.content.toString())).data
  
      // console.log(JSON.parse(msg.content.toString()))
      const { type, data, id, workerId } = JSON.parse(msg.content.toString());
      if (type === `textlog`) {
        io.to(id).emit(type, data);
        await Textlog.create({ text: data, workerId: workerId });
      }
      if (type === `error`) {
        io.to(id).emit(type, data);
        await Worker.findByIdAndUpdate(workerId, { $inc: { failed: 1 } });
        await Textlog.create({ text: data, workerId: workerId });
      }
      if (type === `product`) {
        io.to(id).emit(type, data);
        io.to(id).emit(`success`);
        await Product.create({
          image: data.image,
          name: data.name,
          price: Number(Number(data.price.replace("đ", "").replace(".", ""))),
          description: data.description,
          link: data.link,
          workerId: workerId,
        });
        await Worker.findByIdAndUpdate(workerId, { $inc: { sucess: 1 } });
      }
      if (type === `imageReview`) {
        io.to(id).emit("image", data);
        const worker = await Worker.findById(workerId);
        if (worker) {
          let imageRV = worker.imageReview;
          imageRV.shift();
          imageRV.push(data);
          // worker.imageReview = imageRV;
          // await worker.update();
          await Worker.findByIdAndUpdate(workerId, {imageReview: imageRV});
        } else {
          throw new Error("Couldn't find worker id");
        }
      }
      if (type === "speed") {
        const worker = await Worker.findById(workerId);
        if (worker) {
          worker.speed = (worker.sucess / +data) * 60;
        }
        await worker.save();
      }
      if(type ==='active') {
        await Worker.findByIdAndUpdate(workerId, {active: data});
      }
      if(type === 'browser') {
        await Worker.findByIdAndUpdate(workerId, {browser: data})
      }
    },
    {
      noAck: true,
    }
  );
};

module.exports = {
  receiveMsg,
};
