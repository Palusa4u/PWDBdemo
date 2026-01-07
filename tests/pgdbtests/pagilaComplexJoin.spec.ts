import { test, expect } from '@playwright/test';
import { dbPool } from '../../src/db/dbPool';

/**
 * This test demonstrates complex join queries
 * on the Pagila PostgreSQL database.
 */

test.describe('Pagila DB Complex Join Validations', () => {

  test('Validate total rentals per store and top customers', async () => {
    const query = `
      SELECT s.store_id,
             c.customer_id,
             c.first_name,
             c.last_name,
             COUNT(r.rental_id) AS total_rentals,
             SUM(p.amount) AS total_paid
      FROM store s
      INNER JOIN staff st ON s.store_id = st.store_id
      INNER JOIN customer c ON c.store_id = s.store_id
      INNER JOIN rental r ON r.customer_id = c.customer_id
      INNER JOIN payment p ON p.rental_id = r.rental_id
      GROUP BY s.store_id, c.customer_id, c.first_name, c.last_name
      ORDER BY s.store_id, total_rentals DESC
      LIMIT 10;
    `;

    const results = await dbPool.query(query);
    console.log('Pagila Store - Customer rental summary:', results);

    // Basic validation
    expect(results.length).toBeGreaterThan(0);

    for (const row of results) {
      // Expected structure validation
      expect(row.store_id).toBeGreaterThan(0);
      expect(row.customer_id).toBeGreaterThan(0);
      expect(Number(row.total_rentals)).toBeGreaterThanOrEqual(0);
      expect(Number(row.total_paid)).toBeGreaterThanOrEqual(0);

      // Example of expected vs actual comparison
      const expectedStoreId = [1, 2];
      expect(expectedStoreId).toContain(row.store_id);

      // You can add specific rule-based checks
      if (row.total_rentals > 30) {
        expect(Number(row.total_paid)).toBeGreaterThan(100); // high rental => high payment
      }
    }
  });

  test('Cross-verify film category rental counts', async () => {
    const query = `
      SELECT c.name AS category,
             COUNT(r.rental_id) AS rentals_count,
             AVG(p.amount) AS avg_payment
      FROM category c
      INNER JOIN film_category fc ON c.category_id = fc.category_id
      INNER JOIN film f ON f.film_id = fc.film_id
      INNER JOIN inventory i ON i.film_id = f.film_id
      INNER JOIN rental r ON r.inventory_id = i.inventory_id
      INNER JOIN payment p ON p.rental_id = r.rental_id
      GROUP BY c.name
      ORDER BY rentals_count DESC
      LIMIT 5;
    `;

    const rows = await dbPool.query(query);
    console.log('pagila Top categories by rental volume:', rows);

    expect(rows.length).toBe(5);

    // Validation loop
    for (const row of rows) {
      expect(typeof row.category).toBe('string');
      expect(Number(row.rentals_count)).toBeGreaterThan(0);
      expect(Number(row.avg_payment)).toBeGreaterThan(0);

      // Example: Ensure Comedy and Action appear in top results (depending on data)
      const possibleCategories = ['Action', 'Comedy', 'Sci-Fi', 'Sports', 'Animation'];
      expect(possibleCategories).toContain(row.category);
    }
  });

//   test('Validate revenue by staff and store', async () => {
//     const query = `
//       SELECT st.staff_id,
//              st.first_name,
//              st.last_name,
//              s.store_id,
//              SUM(p.amount) AS total_revenue
//       FROM staff st
//       INNER JOIN store s ON s.store_id = st.store_id
//       INNER JOIN payment p ON p.staff_id = st.staff_id
//       GROUP BY st.staff_id, st.first_name, st.last_name, s.store_id
//       ORDER BY total_revenue DESC;
//     `;

//     const result = await dbPool.query(query);
//     console.log('pagila Revenue by staff:', result);

//     expect(result.length).toBeGreaterThan(0);

//     for (const row of result) {
//       expect(row.staff_id).toBeGreaterThan(0);
//       expect(row.total_revenue).toBeGreaterThan(0);

//       // Business logic validation
//       if (row.staff_id === 1) {
//         // Example: expected revenue threshold
//         expect(Number(row.total_revenue)).toBeGreaterThan(1000);
//       }
//     }
//   });
});
