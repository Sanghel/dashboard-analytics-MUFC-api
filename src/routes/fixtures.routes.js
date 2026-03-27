const router = require('express').Router();
const { list, recent, upcoming, detail } = require('../controllers/fixtures.controller');

router.get('/', list);
router.get('/recent', recent);
router.get('/upcoming', upcoming);
router.get('/:id', detail);

module.exports = router;
