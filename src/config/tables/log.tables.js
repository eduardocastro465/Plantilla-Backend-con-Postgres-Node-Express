export const createLogsTable = async (client) => {
    await client.query(`
        DO $$ BEGIN
            CREATE TYPE enum_log_nivel AS ENUM ('error', 'warn', 'info', 'http', 'sql');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    `);

    await client.query(`
        DO $$ BEGIN
            CREATE TYPE enum_log_metodo AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS tblLogs (
            id          SERIAL PRIMARY KEY,
            nivel       enum_log_nivel DEFAULT 'error',
            mensaje     VARCHAR(500) NOT NULL,
            ruta        VARCHAR(255),
            metodo      enum_log_metodo,
            status_code INT,
            usuario_id  INT,
            ip          VARCHAR(45),
            user_agent  TEXT,
            body        JSONB,
            query       JSONB,
            params      JSONB,
            stack       TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_logs_nivel       ON tblLogs(nivel);
        CREATE INDEX IF NOT EXISTS idx_logs_ruta        ON tblLogs(ruta);
        CREATE INDEX IF NOT EXISTS idx_logs_metodo      ON tblLogs(metodo);
        CREATE INDEX IF NOT EXISTS idx_logs_created_at  ON tblLogs(created_at);
        CREATE INDEX IF NOT EXISTS idx_logs_usuario_id  ON tblLogs(usuario_id);
        CREATE INDEX IF NOT EXISTS idx_logs_status_code ON tblLogs(status_code);
    `);

    await client.query(`
        DROP TRIGGER IF EXISTS trg_logs_updated_at ON tblLogs;
        CREATE TRIGGER trg_logs_updated_at
        BEFORE UPDATE ON tblLogs
        FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at()
    `);
};