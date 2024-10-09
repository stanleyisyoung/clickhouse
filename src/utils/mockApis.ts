import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { Customer, Product, Shipment } from '../types';

const mock = new MockAdapter(axios);

export const mockApiSetup = () => {
  // GET customer by ID
  mock.onGet(/\/api\/customers\/\w+/).reply((config) => {
    const customerId = config.url?.split('/').pop();
    return [200, {id: customerId} as  Customer]
  });
  // GET product by ID
  mock.onGet(/\/api\/products\/\w+/).reply((config) => {
    const productId = config.url?.split('/').pop();
    return [200, {id: productId} as Product]
  });
    // POST create shipment
  mock.onPost('/api/shipments').reply((config) => {
    const shipment: Shipment = JSON.parse(config.data);
    return [200, { id: shipment.id } as Shipment];
  });
};
