const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/db");
const initRoutes = require("./src/routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const connect = require('./config/rabbitmq')
const { createServer } = require("http");
const {socketModule} = require('./src/modules/socket');
const { Server } = require("net");
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const port = process.env.PORT;
app.use("/images", express.static("./scraper/img"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ["http://127.0.0.1:5500", "http://localhost:3000"]
  })
);

dbConnect();
// app.get('/', (req, res) => {
//   res.json('haha')
// })
initRoutes(app)
const server = createServer(app);

socketModule(server);


//-------------------------------------
server.listen(port, () => {
  console.log("Server listening on port: " + port);
});
