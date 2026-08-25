const express = require('express');
const roomsController = require('../controllers/roomsController');

const router = express.Router();

router.post('/', roomsController.createRoom);
router.get('/:id', roomsController.getRoom);
router.post('/:roomId/furniture', roomsController.addFurniture);
router.get('/:roomId/furniture', roomsController.getFurniture);

module.exports = router;