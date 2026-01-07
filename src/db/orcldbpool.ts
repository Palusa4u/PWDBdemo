import oracledb from 'oracledb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export async function connectToDatabaseNew() {
  try {
    // Initialize Oracle Client with the Wallet location
    oracledb.initOracleClient({ configDir: process.env.TNS_ADMIN });

    // Create a connection to the Autonomous Database
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_ALIAS, // TNS alias or host:port/service
    });

    console.log('Successfully connected to the database.');
    return connection;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
}

//module.exports = { connectToDatabaseNew };