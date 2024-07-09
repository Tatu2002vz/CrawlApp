const mongoose = require("mongoose");
var amqp = require("amqplib");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect("103.252.72.210:27017");
    if (conn.connection.readyState === 1) console.log("Connected");
    else console.log("Connecting");
  } catch (error) {
    console.log("Connection error:" + error.message);
    // throw new Error(error);
  }
};

module.exports = dbConnect;
