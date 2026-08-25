const fitService = require('../services/fitService');
const validateFitCheck = require('../validation/validateFitCheck');

function fitCheck(req, res) {
  const errors = validateFitCheck(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const fit = fitService.calculateFit(req.body.room, req.body.furniture);

    return res.status(200).json({
      room: req.body.room,
      furniture: req.body.furniture,
      fit,
    });
  } catch (error) {
    if (error.message === 'Invalid dimensions') {
      return res.status(400).json({ errors: error.details || { request: error.message } });
    }

    return res.status(500).json({ error: 'Unable to calculate fit' });
  }
}

module.exports = { fitCheck };
