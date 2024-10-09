import axios from "axios";
import { Shipment } from "../types";

export const createShipment = async (shipment: Shipment): Promise<void> => {
  await axios.post(`http://example.com/api/shipments`, shipment);
};