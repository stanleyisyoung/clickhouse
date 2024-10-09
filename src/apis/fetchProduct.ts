import axios from "axios";
import { Product } from "../types";

export const fetchProduct = async (productId: string): Promise<Product> => {
  const response = await axios.get(`http://example.com/api/products/${productId}`);
  return response.data;
};

