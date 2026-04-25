import { createLogsTable } from "./log.tables.js";
import { createRolesTable } from "./roles.table.js";
import { createUsuariosTable, createPerfilUsuarioTable, createDispositivosTable } from "./usuarios.table.js";
import { createTareasTable, createTareaComentariosTable } from "./tareas.table.js";
import { createAdjuntosTable } from "./adjuntos.tables.js";

export const initTables = async (client) => {
    // Crear la función de updated_at primero
    await client.query(`
        CREATE OR REPLACE FUNCTION fn_update_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
    `);

    await createLogsTable(client);
    await createRolesTable(client);
    await createUsuariosTable(client);
    await createPerfilUsuarioTable(client);
    await createDispositivosTable(client);
    await createTareasTable(client);
    await createTareaComentariosTable(client);
    await createAdjuntosTable(client);
};