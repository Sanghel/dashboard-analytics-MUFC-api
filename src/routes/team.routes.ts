import { Router } from 'express';
import { stats } from '../controllers/team.controller';

const router = Router();

router.get('/stats', stats);

export default router;
