// Mis mensajes de log
// Aqui van los mensajes que se imprimen en consola al iniciar la aplicacion

export const LOG_MESSAGES = {
    DB_CONECTADA: (fecha) => [
        `   🚀 Base de datos conectada 💻`,
        ` Hora de conexión: ${fecha} `,
    ],
    DB_ERROR_CONEXION: (err) => [
        `🔥 ERROR: No se pudo conectar a la base de datos`,
        `Detalles: ${err}`,
    ],

    DB_ERROR_DESCONOCIDO: `Error desconocido`,

    TABLAS_LISTAS: [
        `    📦 Tablas listas 📝`,
    ],
    DB_ERROR_INIT: (err) => [
        `⚠️ ERROR: Fallo al inicializar la base de datos`,
        `Detalles: ${err}`,
    ],

    SERVIDOR_INICIADO: (port, production) => [
        ` 🌐 Servidor en modo ${production ? '🚀 Producción' : 'Desarrollo 💻'}`,
        ` 🔥 API: http://localhost:${port} 📦 `,
    ],
};