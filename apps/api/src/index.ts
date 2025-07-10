import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import gasRouter from './routes/gas.routes';
import { startIngestionService } from './services/ingestion.service';

// --- 1. Load Environment Variables ---
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(process.cwd(), '.env');
  const configResult = dotenv.config({ path: envPath });

  if (configResult.error) {
    console.error('❌ FATAL: Error loading .env file:', configResult.error);
    process.exit(1);
  }
}

// Check for keys in process.env
const infuraKeyLoaded = !!process.env.INFURA_API_KEY;
const alchemyKeyLoaded = !!process.env.ALCHEMY_API_KEY;
const dbUrlLoaded = !!process.env.DATABASE_URL;

if (!infuraKeyLoaded || !alchemyKeyLoaded || !dbUrlLoaded) {
    console.error('❌ CRITICAL: One or more required keys are missing. Halting application.');
    process.exit(1);
}

// --- 2. Start Express Web Server ---
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

app.use('/api/gas', gasRouter);

app.get('/', (req, res) => {
  res.send('GAStronaut API is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 GAStronaut API server listening at http://localhost:${PORT}`);
});

// --- 3. Start Ingestion Service in Background ---
startIngestionService().catch((error: any) => {
  console.error('❌ Fatal error in ingestion service:', error);
  process.exit(1);
});