import { Request, Response } from 'express';
import { CreditTransactionService } from '../services/creditService';

export const addCredit = (req: Request, res: Response) => {
  const { customerId, amount, reason } = req.body;
  const transaction = CreditTransactionService.addCredit({customerId, amount, reason});
  res.status(201).json(transaction);
};

export const getCreditBalance = (req: Request, res: Response) => {
  const { customerId } = req.params;
  const balance = CreditTransactionService.getCreditBalance(customerId);
  res.json({ customerId, balance });
};
