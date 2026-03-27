import { Router } from 'express';
import { overview } from '../controllers/analytics.controller';

const router = Router();

router.get('/overview', overview);

export default router;
