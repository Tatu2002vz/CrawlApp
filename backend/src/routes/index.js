
const { notFound, errHandle } = require("../middlewares/errorHandle");
const productCtrl = require('../controllers/product')
const workerRoute = require('./worker')
const initRoutes = (app) => {

  app.use('/worker', workerRoute)
  app.use(notFound);
  app.use(errHandle);
};

module.exports = initRoutes;
