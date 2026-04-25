export const createTareasTable = async (client) => {
    await client.query(`
        DO $$ BEGIN
            CREATE TYPE enum_tarea_prioridad AS ENUM ('baja', 'media', 'alta');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    `);

    await client.query(`
        DO $$ BEGIN
            CREATE TYPE enum_tarea_estado AS ENUM ('pendiente', 'en_proceso', 'completada', 'no_completada', 'eliminada');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS tblTareas (
            id                      SERIAL PRIMARY KEY,
            titulo                  VARCHAR(50) NOT NULL,
            descripcion             VARCHAR(500),
            prioridad               enum_tarea_prioridad DEFAULT 'media',
            creado_por              INT NOT NULL,
            asignado_a              INT,
            hora_inicio             TIMESTAMP NOT NULL,
            hora_fin                TIMESTAMP NOT NULL,
            estado                  enum_tarea_estado DEFAULT 'pendiente',
            razon_no_completada     VARCHAR(500),
            created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at              TIMESTAMP DEFAULT NULL,

            CONSTRAINT fk_tarea_creador  FOREIGN KEY (creado_por) REFERENCES tblUsuarios(id),
            CONSTRAINT fk_tarea_asignado FOREIGN KEY (asignado_a) REFERENCES tblUsuarios(id)
        )
    `);

    await client.query(`
        DROP TRIGGER IF EXISTS trg_tareas_updated_at ON tblTareas;
        CREATE TRIGGER trg_tareas_updated_at
        BEFORE UPDATE ON tblTareas
        FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at()
    `);
};

export const createTareaComentariosTable = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS tblTarea_comentarios (
            id          SERIAL PRIMARY KEY,
            tarea_id    INT NOT NULL,
            usuario_id  INT NOT NULL,
            comentario  VARCHAR(500) NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at  TIMESTAMP DEFAULT NULL,

            CONSTRAINT fk_comentario_tarea   FOREIGN KEY (tarea_id)   REFERENCES tblTareas(id),
            CONSTRAINT fk_comentario_usuario FOREIGN KEY (usuario_id) REFERENCES tblUsuarios(id)
        )
    `);

    await client.query(`
        DROP TRIGGER IF EXISTS trg_comentarios_updated_at ON tblTarea_comentarios;
        CREATE TRIGGER trg_comentarios_updated_at
        BEFORE UPDATE ON tblTarea_comentarios
        FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at()
    `);
};