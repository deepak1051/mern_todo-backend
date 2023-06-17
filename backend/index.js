import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import goalRoutes from './routes/goalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

connectDB();

app.get('/', (req, res) => {
  res.send('homepage');
});

app.use('/api/goals', goalRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
