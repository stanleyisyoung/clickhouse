import { v4 as uuidv4 } from 'uuid';
import { creditTransactions } from '../models/creditTransaction';
import { CreditTransaction } from '../types';

export type AddCreditType = {
  customerId: string; 
  amount: number;
  reason: CreditTransaction['reason'];
}
export class CreditTransactionService {
  static addCredit = ({customerId, amount, reason}: AddCreditType): CreditTransaction => {
    const currentBalance = this.getCreditBalance(customerId);
    if (currentBalance + amount < 0){
      throw new Error('Final balance cannot be negative')
    }
    const transaction: CreditTransaction = {
      id: uuidv4(),
      customerId,
      amount,
      reason,
      createdAt: Date.now()
    };

    if (!creditTransactions[customerId]) {
      creditTransactions[customerId] = [];
    }
    creditTransactions[customerId].push(transaction);

    return transaction;
  }

  static getCreditBalance = (customerId: string): number => {
    // NOTE: This calculates the balance using the 
    //  customer's history of transactions. This is likely a bottleneck
    //  as the number of transactions increase for a customer. We should add
    //  snapshotting/caching in the future. 
    const transactions = creditTransactions[customerId] || [];
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }
}
