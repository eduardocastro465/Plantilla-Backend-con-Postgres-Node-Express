export const createRolesTable = async (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS tblRoles (
            id          SERIAL PRIMARY KEY,
            rol         VARCHAR(30) NOT NULL UNIQUE,
            descripcion VARCHAR(250),
            activo      BOOLEAN DEFAULT TRUE,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await client.query(`
        DROP TRIGGER IF EXISTS trg_roles_updated_at ON tblRoles;
        CREATE TRIGGER trg_roles_updated_at
        BEFORE UPDATE ON tblRoles
        FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at()
    `);
};