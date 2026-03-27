const router = require('express').Router();
const { list } = require('../controllers/standings.controller');

router.get('/', list);

module.exports = router;
