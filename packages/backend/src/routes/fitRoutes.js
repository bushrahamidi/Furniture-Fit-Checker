const express = require('express');
const fitController = require('../controllers/fitController');

const router = express.Router();

router.post('/', fitController.fitCheck);

module.exports = router;
