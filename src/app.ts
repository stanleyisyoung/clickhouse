import express from 'express';
import creditRoutes from './routes/creditRoutes';
import purchaseRoutes from './routes/purchaseRoutes';

const app = express();

app.use(express.json());
app.use('/api', creditRoutes);
app.use('/api', purchaseRoutes);

export default app;
