import { Router, Request, Response } from 'express';
import fixturesRoutes from './fixtures.routes';
import standingsRoutes from './standings.routes';
import playersRoutes from './players.routes';
import teamRoutes from './team.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
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

export default router;
