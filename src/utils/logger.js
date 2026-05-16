import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';
import { modoProduction } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFile = path.join(__dirname, '../logs/error.log');

// Asegurar que la carpeta logs existe
if (!fs.existsSync(path.dirname(logFile))) {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
}

export const logError = async (error, req = null, nivel = 'error') => {

    const logData = {
        nivel: nivel,
        mensaje: error.message || error,
        timestamp: new Date().toISOString(),
        ruta: req?.originalUrl || null,
        metodo: req?.method || null,
        status_code: error.status || 500,
        usuario_id: req?.user?.id || null,
        ip: req?.ip || req?.connection?.remoteAddress || null,
        user_agent: req?.headers?.['user-agent'] || null,
        stack: error.stack || null
    };

    // Guardar body (sin datos sensibles)
    if (req?.body && req.method !== 'GET') {
        const bodySanitizado = { ...req.body };
        if (bodySanitizado.password) bodySanitizado.password = '***';
        if (bodySanitizado.newPassword) bodySanitizado.newPassword = '***';
        logData.body = JSON.stringify(bodySanitizado);
    }

    // GUARDAR EN ARCHIVO
    const logLine = JSON.stringify(logData, null, 2) + '\n---\n';
    fs.appendFileSync(logFile, logLine);

    // GUARDAR EN BASE DE DATOS
    try {
        await pool.query(
            `INSERT INTO tblLogs (nivel, mensaje, ruta, metodo, status_code, usuario_id, ip, user_agent, body, stack)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                logData.nivel,
                logData.mensaje,
                logData.ruta,
                logData.metodo,
                logData.status_code,
                logData.usuario_id,
                logData.ip,
                logData.user_agent,
                logData.body || null,
                logData.stack
            ]
        );
    } catch (dbError) {
        fs.appendFileSync(logFile, `[ERROR BD] ${dbError.message}\n`);
    }

    // Mostrar en consola en desarrollo
    if (modoProduction !== 'production') {
        console.error(`ERROR: ${logData.mensaje} | ${logData.ruta || ''} | ${logData.metodo || ''}`);
    }
};

// Función para logs sin req (errores internos)
export const logSimple = async (mensaje, nivel = 'error') => {
    const logData = {
        nivel: nivel,
        mensaje: mensaje,
        timestamp: new Date().toISOString()
    };

    // Guardar en archivo
    fs.appendFileSync(logFile, JSON.stringify(logData, null, 2) + '\n---\n');

    // Guardar en BD
    try {
        await pool.query(
            `INSERT INTO tblLogs (nivel, mensaje) VALUES ($1, $2)`,
            [nivel, mensaje]
        );
    } catch (dbError) {
        console.error('Error al guardar log:', dbError.message);
    }
};