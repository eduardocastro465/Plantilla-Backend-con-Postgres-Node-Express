import pg from 'pg';
import 'dotenv/config';
import { modoProduction } from '../config.js';
import { textoColorido } from '../utils/colorText.js';
import { LOG_MESSAGES } from '../constants/logMessages.js';
import { initTables } from './tables/index.js';

const { Client } = pg;

async function initDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await initTables(client);

    textoColorido(
      LOG_MESSAGES.TABLAS_LISTAS,
      ["rgb(156, 60, 255)", "rgba(89, 0, 109, 1)"],
      modoProduction
    );

  } catch (error) {
    textoColorido(
      LOG_MESSAGES.DB_ERROR_INIT(error.message),
      ["rgb(255, 230, 0)", "rgb(180, 100, 0)"],
      modoProduction
    );
  } finally {
    await client.end();
  }
}

export default initDb;