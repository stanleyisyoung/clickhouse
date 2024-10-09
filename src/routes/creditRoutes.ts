import { Router } from 'express';
import { addCredit, getCreditBalance } from '../controllers/creditController';

const router = Router();

router.post('/credit', addCredit);
router.get('/credit/:customerId', getCreditBalance);

export default router;
