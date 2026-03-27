const router = require('express').Router();
const fixturesRoutes = require('./fixtures.routes');
const standingsRoutes = require('./standings.routes');
const playersRoutes = require('./players.routes');
const teamRoutes = require('./team.routes');
const analyticsRoutes = require('./analytics.routes');

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

router.use('/fixtures', fixturesRoutes);
router.use('/standings', standingsRoutes);
router.use('/players', playersRoutes);
router.use('/team', teamRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
