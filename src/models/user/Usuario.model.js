import pool from '../../config/db.js';

const UsuarioModel = {

    getAll: async () => {
        const { rows } = await pool.query(`
            SELECT
                u.id, u.foto, u.usuario, u.email, u.activo, u.rol_id, u.created_at,
                p.nombre, p.apellido, p.edad, p.telefono
            FROM tblUsuarios u
            LEFT JOIN tblPerfil_usuarios p ON p.usuario_id = u.id
            WHERE u.deleted_at IS NULL
        `);
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query(`
            SELECT
                u.id, u.foto, u.usuario, u.email, u.activo, u.rol_id, u.created_at,
                p.nombre, p.apellido, p.edad, p.telefono
            FROM tblUsuarios u
            LEFT JOIN tblPerfil_usuarios p ON p.usuario_id = u.id
            WHERE u.id = $1 AND u.deleted_at IS NULL
        `, [id]);
        return rows[0];
    },

    getByEmail: async (email) => {
        const { rows } = await pool.query(`
            SELECT
                u.id, u.foto, u.usuario, u.email, u.activo, u.rol_id, u.created_at,
                p.nombre, p.apellido, p.edad, p.telefono
            FROM tblUsuarios u
            LEFT JOIN tblPerfil_usuarios p ON p.usuario_id = u.id
            WHERE u.email = $1 AND u.deleted_at IS NULL
        `, [email]);
        return rows[0];
    },

    getByUsuario: async (usuario) => {
        const { rows } = await pool.query(`
            SELECT
                u.id, u.foto, u.usuario, u.email, u.activo, u.rol_id, u.created_at,
                p.nombre, p.apellido, p.edad, p.telefono
            FROM tblUsuarios u
            LEFT JOIN tblPerfil_usuarios p ON p.usuario_id = u.id
            WHERE u.usuario = $1 AND u.deleted_at IS NULL
        `, [usuario]);
        return rows[0];
    },

    update: async (id, usuario, email) => {
        await pool.query(
            'UPDATE tblUsuarios SET usuario = $1, email = $2 WHERE id = $3',
            [usuario, email, id]
        );
    },

    updateFoto: async (id, foto) => {
        await pool.query(
            'UPDATE tblUsuarios SET foto = $1 WHERE id = $2',
            [foto, id]
        );
    },

    softDelete: async (id) => {
        await pool.query(
            'UPDATE tblUsuarios SET deleted_at = NOW(), activo = FALSE WHERE id = $1',
            [id]
        );
    },
};

export default UsuarioModel;