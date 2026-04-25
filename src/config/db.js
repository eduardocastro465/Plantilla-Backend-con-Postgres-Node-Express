import pg from 'pg';
import 'dotenv/config';
import { modoProduction } from '../config.js';
import { textoColorido } from '../utils/colorText.js';
import { LOG_MESSAGES } from '../constants/logMessages.js';
import { formatearFecha } from '../utils/formateo.js';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(client => {
        textoColorido(
            LOG_MESSAGES.DB_CONECTADA(formatearFecha()),
            ["rgb(60, 255, 0)", "rgb(9, 108, 20)"],
            modoProduction
        );
        client.release();
    })
    .catch(err => {
        const mensajeError = err.message || err.code || LOG_MESSAGES.DB_ERROR_DESCONOCIDO;
        textoColorido(
            LOG_MESSAGES.DB_ERROR_CONEXION(mensajeError),
            ["rgb(255, 0, 0)", "rgb(255, 69, 0)"],
            modoProduction
        );
        process.exit(1);
    });

export default pool;