const router = require('express').Router();
const { stats } = require('../controllers/team.controller');

router.get('/stats', stats);

module.exports = router;
