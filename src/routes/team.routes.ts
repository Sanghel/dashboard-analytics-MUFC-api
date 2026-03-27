import { Router } from 'express';
import { info, stats } from '../controllers/team.controller';

const router = Router();

router.get('/info', info);
router.get('/stats', stats);

export default router;
