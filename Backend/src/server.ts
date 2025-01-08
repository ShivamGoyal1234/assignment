import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { locationRoutes } from './routes/Locations';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api', locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));