import axios from "axios";
import { Customer } from "../types";

export const fetchCustomer = async (customerId: string): Promise<Customer> => {
  const response = await axios.get(`http://example.com/api/customers/${customerId}`);
  return response.data;
};

