// tests/user.spec.ts
import { test, expect } from '@playwright/test';
import { insertUser, insertUsers, getAllUsers, getUserByEmail, clearUsers } from '../../src/db/db';

test.describe('PostgreSQL DB Integration', () => {
  // test.afterAll(async () => {
  //   await clearUsers();
  // });

  test('Insert single user and verify', async ({ page }) => {
    const name = 'Shiva Palusa';
    const email = 'shivap@cybage.com';

    await insertUser(name, email);

    const user = await getUserByEmail(email);
    expect(user.name).toBe(name);
    console.log('Fetched single user:', user);
  });

  test('Insert multiple users and loop through results', async ({ page }) => {
    const users = [
      { name: 'Shiva', email: 'shivap@cyabge.com' },
      { name: 'Dipuna', email: 'dipuna@cybage.com' },
      { name: 'Venkat', email: 'Venkat@cybage.com' }
    ];

    await insertUsers(users);

    const allUsers = await getAllUsers();
    console.log('All users in DB:');
    
    // Loop through all rows
    for (const u of allUsers) {
      console.log(`ID: ${u.id}, Name: ${u.name}, Email: ${u.email}`);
    }

    // Fetch a specific row (e.g., 2nd record)
    const secondUser = allUsers[1];
    console.log(' user in result set:', secondUser);
    expect(secondUser.name).toBe('Shiva');
    
  });

});
