// db/dbClient.ts
import { Client } from 'pg';

export class DBClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'testdb',
    });
  }

  async connect() {
    await this.client.connect();
    console.log(' Connected to PostgreSQL database');
  }

  async disconnect() {
    await this.client.end();
    console.log(' Disconnected from PostgreSQL');
  }

  async runQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
    const result = await this.client.query(query, params);
    return result.rows;
  }
}
