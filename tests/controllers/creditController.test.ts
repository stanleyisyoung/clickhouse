import request from 'supertest';
import app from '../../src/app';
import { creditTransactions } from '../../src/models/creditTransaction';

describe('CreditController', () => {
  beforeEach(() => {
    for (const key in creditTransactions) {
      delete creditTransactions[key];
    }
  });

  it('should grant credit to a customer', async () => {
    const response = await request(app)
      .post('/api/credit')
      .send({ customerId: '123', amount: 100, reason: 'Add credit' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.customerId).toBe('123');
    expect(response.body.amount).toBe(100);
  });

  it('should get a customers credit balance', async () => {
    await request(app)
      .post('/api/credit')
      .send({ customerId: '123', amount: 100, reason: 'Add credit' });

    const response = await request(app).get('/api/credit/123');

    expect(response.status).toBe(200);
    expect(response.body.customerId).toBe('123');
    expect(response.body.balance).toBe(100);
  });
});
