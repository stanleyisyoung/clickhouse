import { Router } from 'express';
import { purchaseProduct, listPurchases, refundPurchase } from '../controllers/purchaseController';

const router = Router();

router.post('/purchase', purchaseProduct);
router.get('/purchases/:customerId', listPurchases);
router.post('/refund', refundPurchase);

export default router;
