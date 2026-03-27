const router = require('express').Router();
const { stats, info } = require('../controllers/team.controller');

router.get('/info', info);
router.get('/stats', stats);

module.exports = router;
