import pool from '../../config/db.js';

const PerfilUsuarioModel = {

    getAll: async () => {
        const { rows } = await pool.query(`
            SELECT id, usuario_id, nombre, apellido, edad, telefono, created_at
            FROM tblPerfil_usuarios
        `);
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query(`
            SELECT id, usuario_id, nombre, apellido, edad, telefono, created_at
            FROM tblPerfil_usuarios
            WHERE id = $1
        `, [id]);
        return rows[0];
    },

    getByUsuarioId: async (usuario_id) => {
        const { rows } = await pool.query(`
            SELECT id, usuario_id, nombre, apellido, edad, telefono, created_at
            FROM tblPerfil_usuarios
            WHERE usuario_id = $1
        `, [usuario_id]);
        return rows[0];
    },

    create: async (usuario_id, { nombre, apellido, edad, telefono }) => {
        const { rows } = await pool.query(`
            INSERT INTO tblPerfil_usuarios (usuario_id, nombre, apellido, edad, telefono)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `, [usuario_id, nombre, apellido, edad, telefono]);
        return rows[0].id;
    },

    update: async (usuario_id, { nombre, apellido, edad, telefono }) => {
        await pool.query(`
            UPDATE tblPerfil_usuarios
            SET nombre = $1, apellido = $2, edad = $3, telefono = $4
            WHERE usuario_id = $5
        `, [nombre, apellido, edad, telefono, usuario_id]);
    },

    delete: async (usuario_id) => {
        await pool.query(
            'DELETE FROM tblPerfil_usuarios WHERE usuario_id = $1',
            [usuario_id]
        );
    }
};

export default PerfilUsuarioModel;