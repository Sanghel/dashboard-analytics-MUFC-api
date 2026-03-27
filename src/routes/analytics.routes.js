const router = require('express').Router();
const { overview } = require('../controllers/analytics.controller');

router.get('/overview', overview);

module.exports = router;
