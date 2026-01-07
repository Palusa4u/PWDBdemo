import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export class DBPool {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.PG_DATABASE,
      max: 5,
    });
  }

  async query<T = any>(query: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async close() {
    await this.pool.end();
    console.log('PostgreSQL pool closed');
  }
}

// Export a single instance
export const dbPool = new DBPool();
