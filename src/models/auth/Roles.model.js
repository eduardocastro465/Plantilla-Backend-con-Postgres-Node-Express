import pool from '../../config/db.js';
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';

const RolesModel = {

    getAll: async () => {
        const { rows } = await pool.query(
            'SELECT id, rol, descripcion, activo, created_at FROM tblRoles ORDER BY id'
        );
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query(
            'SELECT id, rol, descripcion, activo, created_at FROM tblRoles WHERE id = $1',
            [id]
        );
        return rows[0] || null;
    },

    create: async (rol, descripcion, activo) => {
        const { rows: existe } = await pool.query(
            'SELECT id FROM tblRoles WHERE rol = $1',
            [rol]
        );

        if (existe.length > 0) {
            throw new Error(ERROR_MESSAGES.YA_EXISTE('rol'));
        }

        const { rows } = await pool.query(
            'INSERT INTO tblRoles (rol, descripcion, activo) VALUES ($1, $2, $3) RETURNING id',
            [rol, descripcion, activo]
        );

        return rows[0].id;
    },

    update: async (id, rol, descripcion, activo) => {
        const { rowCount } = await pool.query(`
            UPDATE tblRoles
            SET rol = $1,
                descripcion = $2,
                activo = $3
            WHERE id = $4
        `, [rol, descripcion, activo, id]);

        if (rowCount === 0) {
            throw new Error(ERROR_MESSAGES.NO_EXISTE('rol'));
        }
        return { id, rol, descripcion, activo };
    },

    toggleActivo: async (id, activo) => {
        const { rowCount } = await pool.query(
            'UPDATE tblRoles SET activo = $1 WHERE id = $2',
            [activo, id]
        );
        return rowCount > 0;
    },

    delete: async (id) => {
        const { rowCount } = await pool.query(
            'DELETE FROM tblRoles WHERE id = $1',
            [id]
        );
        return rowCount > 0;
    },

};

export default RolesModel;