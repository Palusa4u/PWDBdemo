import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

function getClient() {
  return new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

export async function insertUser(name: string, email: string) {
  const client = getClient();
  await client.connect();
  await client.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
  await client.end();
}

/**
 * Insert multiple users at once
 */
export async function insertUsers(users: { name: string; email: string }[]) {
    const client = getClient();
    await client.connect();
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2)';
    for (const user of users) {
      await client.query(query, [user.name, user.email]);
    }
    await client.end();
  }
export async function getUserByEmail(email: string) {
  const client = getClient();
  await client.connect();
  const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  await client.end();
  return result.rows[0];
}

export async function getAllUsers() {
  const client = getClient();
  await client.connect();
  const result = await client.query('SELECT * FROM users');
  await client.end();
  return result.rows;
}

export async function deleteUser(email: string) {
  const client = getClient();
  await client.connect();
  await client.query('DELETE FROM users WHERE email = $1', [email]);
  await client.end();
}   

export async function updateUser(name: string, email: string) {
  const client = getClient();
  await client.connect();
  await client.query('UPDATE users SET name = $1 WHERE email = $2', [name, email]);
  await client.end();
}

export async function getUserById(id: number) {
  const client = getClient();
  await client.connect();
  const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
  await client.end();
  return result.rows[0];
}
export async function deleteUserById(id: number) {
  const client = getClient();
  await client.connect();
  await client.query('DELETE FROM users WHERE id = $1', [id]);
  await client.end();
}
export async function updateUserById(id: number, name: string) {
  const client = getClient();
  await client.connect();
  await client.query('UPDATE users SET name = $1 WHERE id = $2', [name, id]);
  await client.end();
}
export async function clearUsers() {
  const client = getClient();
  await client.connect();
  await client.query('DELETE FROM users');
  await client.end();
}