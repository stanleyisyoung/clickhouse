import request from 'supertest';
import app from '../../src/app';
import { purchases } from '../../src/models/purchase';
import { creditTransactions } from '../../src/models/creditTransaction';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('PurchaseController', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    for (const key in purchases) {
      delete purchases[key];
    }
    for (const key in creditTransactions) {
      delete creditTransactions[key];
    }
    mock = new MockAdapter(axios);
    // customer mock
    mock.onGet('http://example.com/api/customers/123').reply(200, {
      id: '123',
      name: 'John Doe',
      billingAddress: {
        line1: '123 Main St',
        city: 'City',
        postalCode: '12345',
        state: 'State',
        country: 'Country'
      },
      shippingAddress: {
        line1: '123 Main St',
        city: 'City',
        postalCode: '12345',
        state: 'State',
        country: 'Country'
      },
      email: 'john@example.com',
      createdAt: Date.now(),
      lastModifiedAt: Date.now()
    });

    // product mock
    mock.onGet('http://example.com/api/products/abc').reply(200, {
      id: 'abc',
      sku: 'sku123',
      name: 'Product 1',
      description: 'A product',
      price: 50,
      createdAt: Date.now(),
      lastModifiedAt: Date.now()
    });

    // shipment mock
    mock.onPost('http://example.com/api/shipments').reply(200);
  });

  it('should purchase a product', async () => {
    await request(app)
      .post('/api/credit')
      .send({ customerId: '123', amount: 100, reason: 'Initial credit' });

    const response = await request(app)
      .post('/api/purchase')
      .send({ customerId: '123', productId: 'abc', quantity: 1 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.customerId).toBe('123');
    expect(response.body.productId).toBe('abc');
    expect(response.body.totalPrice).toBe(50);
  });

  it('should list purchases for a customer', async () => {
    await request(app)
      .post('/api/credit')
      .send({ customerId: '123', amount: 100, reason: 'Initial credit' });

    await request(app)
      .post('/api/purchase')
      .send({ customerId: '123', productId: 'abc', quantity: 1 });

    const response = await request(app).get('/api/purchases/123');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].customerId).toBe('123');
    expect(response.body[0].productId).toBe('abc');
    expect(response.body[0].totalPrice).toBe(50);
  });

  it('should refund a purchase', async () => {
    await request(app)
      .post('/api/credit')
      .send({ customerId: '123', amount: 100, reason: 'Add credit' });

    const purchaseResponse = await request(app)
      .post('/api/purchase')
      .send({ customerId: '123', productId: 'abc', quantity: 1 });

    const refundResponse = await request(app)
      .post('/api/refund')
      .send({ purchaseId: purchaseResponse.body.id, amount: 50 });

    expect(refundResponse.status).toBe(201);
    expect(refundResponse.body).toHaveProperty('id');
    expect(refundResponse.body.customerId).toBe('123');
    expect(refundResponse.body.amount).toBe(50);

    // Initial credit 100, purchase 50, refund back 50 -> end 100
    const balanceResponse = await request(app).get('/api/credit/123');
    expect(balanceResponse.status).toBe(200);
    expect(balanceResponse.body.balance).toBe(100); 
  });

  it('should not save the purchase or deduct credit if shipment creation fails', async () => {
    // shipment failure
    mock.onPost('http://example.com/api/shipments').reply(500, {
      message: 'Shipment service is unavailable'
    });

    creditTransactions['123'] = [{
      id: 'credit1',
      customerId: '123',
      amount: 100,
      reason: 'Add credit',
      createdAt: Date.now()
    }];

    // purchase product but shipment fails
    const response = await request(app)
      .post('/api/purchase')
      .send({ customerId: '123', productId: 'abc', quantity: 1 });

      expect(response.status).toBe(500);
    expect(response.body.message).toContain('Failed to purchase product');

    // check purchase did not go through
    expect(purchases['123']).toBeUndefined();
    expect(creditTransactions['123'].length).toBe(1);
    expect(creditTransactions['123'][0].amount).toBe(100);
  });
});
