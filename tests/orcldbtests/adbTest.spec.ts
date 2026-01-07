import {test,expect} from '@playwright/test';
import { connectToDatabaseNew } from '../../src/db/orcldbpool';

//const { test, expect } = require('@playwright/test');
//const { connectToDatabaseNew } = require('../../src/db/orcldbpool');

test('Validate data from OCI Autonomous Database', async () => {
  let connection;

  try {
    // Connect to the database
    connection = await connectToDatabaseNew();

    // Execute a sample query
    const result = await connection.execute('SELECT * FROM DUAL');
    console.log('Query Result:', result.rows);

    // Validate the result
    expect(result.rows.length).toBeGreaterThan(0);
  } catch (err) {
    console.error('Test failed:', err);
    throw err;
  } finally {
    // Close the connection
    if (connection) {
      await connection.close();
      console.log('Database connection closed.');
    }
  }
});