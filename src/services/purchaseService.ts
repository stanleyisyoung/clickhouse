import { v4 as uuidv4 } from 'uuid';
import { purchases } from '../models/purchase';
import { creditTransactions } from '../models/creditTransaction';
import { Purchase, CreditTransaction, Customer, Product, Shipment } from '../types';
import { CreditTransactionService } from './creditService';
import { fetchCustomer } from '../apis/fetchCustomer';
import { fetchProduct } from '../apis/fetchProduct';
import { createShipment } from '../apis/createShipment';

export type PurchaseProductType = {
  customerId: string;
  productId: string;
  quantity: number;
}

export class PurchaseService {
  static purchaseProduct = async ({customerId, productId, quantity}:PurchaseProductType): Promise<Purchase> => {
    const customer = await fetchCustomer(customerId);
    const product = await fetchProduct(productId);

    const totalPrice = product.price * quantity;
    const balance = CreditTransactionService.getCreditBalance(customerId);
    if (balance < totalPrice) {
      throw new Error('Insufficient balance for this purchase');
    }

    const shipment: Shipment = {
      id: uuidv4(),
      shippingAddress: customer.shippingAddress,
      products: [{ sku: product.sku, quantity }]
    };

    await createShipment(shipment);

    const purchaseId = uuidv4();
    const purchase: Purchase = {
      id: purchaseId,
      customerId,
      productId,
      shipmentId,
      quantity,
      totalPrice,
      createdAt: Date.now()
    };

    // initialize purchases for customer
    if (!purchases[customerId]) {
      purchases[customerId] = [];
    }
    purchases[customerId].push(purchase);

    creditTransactions[customerId].push({
      id: uuidv4(),
      customerId,
      purchaseId,
      amount: -totalPrice,
      reason: 'Purchase',
      createdAt: Date.now()
    });

    return purchase;
  }

  static listPurchases = (customerId: string): Purchase[] => {
    return purchases[customerId] || [];
  }

  static refundPurchase = (purchaseId: string, amount: number): CreditTransaction => {
    for (const customerId in purchases) {
      const purchase = purchases[customerId].find(purchase => purchase.id === purchaseId);

      if (purchase) {
        // get total amount that's been refunded 
        const totalRefunded = creditTransactions[customerId]
          .filter(trx => trx.reason ==='Refund' && trx.purchaseId === purchaseId)
          .reduce((sum, trx) => sum + trx.amount, 0);
        if (totalRefunded + amount > purchase.totalPrice){
          throw new Error('Refund amount cannot exceed purchase price.');
        }
        const refundTransaction: CreditTransaction = {
          id: uuidv4(),
          customerId,
          purchaseId,
          amount,
          reason: 'Refund',
          createdAt: Date.now()
        };
        creditTransactions[customerId].push(refundTransaction);
        return refundTransaction;
      }
    }
    throw new Error('Invalid refund: purchase not found');
  }
}
