const router = require('express').Router()
const controller = require('../controllers/worker')


router.post('/', controller.activeBot)
router.get('/getAll', controller.getAllWorkers)
router.get('/detail/:id', controller.getDetailWorker)
module.exports = router