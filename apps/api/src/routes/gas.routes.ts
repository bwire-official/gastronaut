import { Router, Request, Response } from 'express';
import pool from '../lib/db';

const gasRouter = Router();

// GET /now - Get the most recent gas price for each chain
// Returns: [{ chain_id, timestamp, price_slow, price_average, price_fast, ... }]
gasRouter.get('/now', async (req: Request, res: Response) => {
  try {
    // Query: For each chain, get the most recent record
    const query = `
      SELECT DISTINCT ON (chain_id) *
      FROM gas_prices
      ORDER BY chain_id, timestamp DESC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching latest gas prices:', error);
    res.status(500).json({ error: 'Failed to fetch gas prices' });
  }
});

export default gasRouter; 