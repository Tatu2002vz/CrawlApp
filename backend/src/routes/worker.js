const router = require('express').Router()
const controller = require('../controllers/worker')


router.post('/', controller.activeBot)
router.get('/getAll', controller.getAllWorkers)
router.get('/detail/:id', controller.getDetailWorker)
router.post('/stop', controller.stopWorker)
module.exports = router