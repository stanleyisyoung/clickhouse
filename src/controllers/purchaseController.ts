import { Request, Response } from 'express';
import { PurchaseService } from '../services/purchaseService';

export const purchaseProduct = async (req: Request, res: Response) => {
  const { customerId, productId, quantity } = req.body;
  try {
    const purchase = await PurchaseService.purchaseProduct({customerId, productId, quantity});
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Failed to purchase product' });
  }
};

export const listPurchases = (req: Request, res: Response) => {
  const { customerId } = req.params;
  const purchases = PurchaseService.listPurchases(customerId);
  res.json(purchases);
};

export const refundPurchase = (req: Request, res: Response) => {
  const { purchaseId, amount } = req.body;
  try {
    const refundTransaction = PurchaseService.refundPurchase(purchaseId, amount);
    res.status(201).json(refundTransaction);
  } catch(error) {
    res.status(404).json({ message: 'Failed to refund purchase'})
  }
  
};
