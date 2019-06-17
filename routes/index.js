const express = require('express');
const ValidatorController = require('../controllers/validator');
const router = express.Router();

router.route('/validators')
    .post(ValidatorController.create)
    .get(ValidatorController.getList);
router.route('/validators/:address')
    .get(ValidatorController.get);

module.exports = router;
