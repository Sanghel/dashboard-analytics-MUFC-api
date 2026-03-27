import { Router } from 'express';
import { list, recent, upcoming, detail } from '../controllers/fixtures.controller';

const router = Router();

router.get('/', list);
router.get('/recent', recent);
router.get('/upcoming', upcoming);
router.get('/:id', detail);

export default router;
