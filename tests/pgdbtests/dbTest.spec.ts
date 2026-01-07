// specs/dbTest.spec.ts
import { test, expect } from '@playwright/test';
import { DBClient } from '../../src/db/dbClient';

test.describe('PostgreSQL DB Validation', () => {
  let db: DBClient;

  test.beforeAll(async () => {
    db = new DBClient();
    await db.connect();
  });

  test.afterAll(async () => {
    await db.disconnect();
  });

  test('should validate data from PostgreSQL using query', async () => {
    const query = `
      SELECT o.id AS order_id, o.total, c.name AS customer_name
      FROM orders o
      INNER JOIN customers c ON o.customer_id = c.id
      WHERE o.status = $1;
    `;
    const resultSet = await db.runQuery(query, ['COMPLETED']);

    // Log total rows
    console.log(`Total completed orders: ${resultSet.length}`);

    // Example: Filter a specific customer
    const customerRow = resultSet.find(r => r.customer_name === 'John Doe');

    // Expect that John's order exists and has a total > 100
    expect(customerRow).toBeDefined();
    expect(Number(customerRow!.total)).toBeGreaterThan(100);

    // Loop through all results for debugging
    for (const row of resultSet) {
      console.log(`Order ${row.order_id} by ${row.customer_name} = ${row.total}`);
      expect(row.total).toBeGreaterThanOrEqual(0); // sanity check
    }
  });
});
