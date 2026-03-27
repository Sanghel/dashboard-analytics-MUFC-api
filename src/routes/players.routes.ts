import { Router } from 'express';
import { list, detail } from '../controllers/players.controller';

const router = Router();

router.get('/', list);
router.get('/:id', detail);

export default router;
