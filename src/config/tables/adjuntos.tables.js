export const createAdjuntosTable = async (client) => {
    await client.query(`
        DO $$ BEGIN
            CREATE TYPE enum_adjunto_categoria AS ENUM ('evidencia', 'documentacion', 'correccion', 'otro');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS tblAdjuntos (
            id              SERIAL PRIMARY KEY,
            tarea_id        INT,
            comentario_id   INT,
            subido_por      INT NOT NULL,
            categoria       enum_adjunto_categoria DEFAULT NULL,
            url             VARCHAR(300) NOT NULL,
            nombre          VARCHAR(255) NOT NULL,
            tipo            VARCHAR(50) NOT NULL,
            tamanio         INT NOT NULL,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at      TIMESTAMP DEFAULT NULL,

            CONSTRAINT fk_adjunto_usuario     FOREIGN KEY (subido_por)    REFERENCES tblUsuarios(id),
            CONSTRAINT fk_adjunto_tarea       FOREIGN KEY (tarea_id)      REFERENCES tblTareas(id),
            CONSTRAINT fk_adjunto_comentario  FOREIGN KEY (comentario_id) REFERENCES tblTarea_comentarios(id)
        )
    `);

    await client.query(`
        DROP TRIGGER IF EXISTS trg_adjuntos_updated_at ON tblAdjuntos;
        CREATE TRIGGER trg_adjuntos_updated_at
        BEFORE UPDATE ON tblAdjuntos
        FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at()
    `);
};