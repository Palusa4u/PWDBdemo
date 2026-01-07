import { test, expect } from '@playwright/test';
import { dbPool } from '../../src/db/dbPool';

// Parameterized input: list of customers to check
const customersToCheck = [
  { first_name: 'Mary', last_name: 'Smith' },
  { first_name: 'Jon', last_name: 'Stephens' },
  { first_name: 'TOMMY', last_name: 'COLLAZO' }
];

test.describe('Pagila DB Parameterized Tests', () => {

  for (const customer of customersToCheck) {
    test(`Check rentals for ${customer.first_name} ${customer.last_name}`, async () => {
      const query = `
        SELECT c.customer_id, c.first_name, c.last_name, r.rental_id, r.rental_date
        FROM customer c
        INNER JOIN rental r ON c.customer_id = r.customer_id
        WHERE c.first_name = $1 AND c.last_name = $2
        ORDER BY r.rental_date DESC
        LIMIT 5;
      `;
      const rows = await dbPool.query(query, [customer.first_name, customer.last_name]);

      console.log(`Found ${rows.length} rentals for ${customer.first_name} ${customer.last_name}`);
      expect(rows.length).toBeGreaterThanOrEqual(0);

      for (const row of rows) {
        expect(row.rental_id).toBeGreaterThan(0);
        expect(row.customer_id).toBeGreaterThan(0);
      }
    });
  }

  test('Top 3 films by rentals', async () => {
    const query = `
      SELECT f.title, COUNT(r.rental_id) AS rental_count
      FROM film f
      LEFT JOIN inventory i ON f.film_id = i.film_id
      LEFT JOIN rental r ON i.inventory_id = r.inventory_id
      GROUP BY f.title
      ORDER BY rental_count DESC
      LIMIT 3;
    `;
    const topFilms = await dbPool.query(query);
    console.log('Top 3 films:', topFilms);

    expect(topFilms.length).toBe(3);
    for (const f of topFilms) {
      expect(Number(f.rental_count)).toBeGreaterThanOrEqual(0);
    }
  });
});
