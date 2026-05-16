import pool from '../../config/db.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from "../../libs/jwt.js";
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';

const AuthModel = {

    comprobarPermisos: async (rol_id) => {
        const { rows } = await pool.query(
            `SELECT r.id, r.rol, r.activo
             FROM tblRoles r
             WHERE r.id = $1`,
            [rol_id]
        );

        if (rows.length === 0) throw new Error(ERROR_MESSAGES.NO_ENCONTRADO('rol'));
        if (!rows[0].activo) throw new Error(ERROR_MESSAGES.USUARIO_DESACTIVADO);

        return rows[0];
    },

    emailExists: async (email) => {
        const { rows } = await pool.query(
            `SELECT id FROM tblUsuarios WHERE email = $1`,
            [email]
        );
        return rows.length > 0;
    },

    guardarCodigoCorreo: async (email, codigo, expira_en) => {

        await pool.query(
            `UPDATE tblCodigos_verificacion SET usado = TRUE WHERE email = $1 AND usado = FALSE`,
            [email]
        );

        await pool.query(
            `INSERT INTO tblCodigos_verificacion (email, codigo, expira_en) VALUES ($1, $2, $3)`,
            [email, codigo, expira_en]
        );
    },

    verificarCodigoCorreo: async (email, codigo) => {
        const { rows } = await pool.query(
            `SELECT * FROM tblCodigos_verificacion
             WHERE email = $1 AND codigo = $2
               AND usado = FALSE AND expira_en > NOW()
             ORDER BY creado_en DESC
             LIMIT 1`,
            [email, codigo]
        );

        return rows[0] ?? null;
    },

    marcarCodigoUsado: async (id) => {
        await pool.query(
            `UPDATE tblCodigos_verificacion SET usado = TRUE WHERE id = $1`,
            [id]
        );
    },

    login: async (email, nombreUsuario, password) => {
        const { rows } = await pool.query(
            `SELECT
                u.id, u.usuario, u.email, u.password,
                u.activo, u.rol_id, r.rol
             FROM tblUsuarios u
             LEFT JOIN tblRoles r ON u.rol_id = r.id
             WHERE u.email = $1 OR u.usuario = $2`,
            [email, nombreUsuario]
        );

        if (rows.length === 0) throw new Error(ERROR_MESSAGES.CREDENCIALES_INCORRECTAS);

        const usuario = rows[0];

        if (!usuario.activo) throw new Error(ERROR_MESSAGES.USUARIO_DESACTIVADO);

        const isValid = await bcrypt.compare(password, usuario.password);
        if (!isValid) throw new Error(ERROR_MESSAGES.CREDENCIALES_INCORRECTAS);

        const payload = {
            id: usuario.id,
            usuario: usuario.usuario,
            email: usuario.email,
            rol_id: usuario.rol_id,
            activo: usuario.activo
        };

        return createAccessToken(payload);
    },

    register: async (usuario, perfilUsuario) => {
        const rol_id = 1;
        const rondas = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(usuario.password, rondas);

        const client = await pool.connect(); // ✅ así se hace en PostgreSQL

        try {
            await client.query('BEGIN');

            const { rows } = await client.query(
                `INSERT INTO tblUsuarios (usuario, email, password, rol_id)
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                [usuario.usuario, usuario.email, contrasenaEncriptada, rol_id]
            );

            const usuario_id = rows[0].id; // ✅ PostgreSQL usa RETURNING, no insertId

            await client.query(
                `INSERT INTO tblPerfil_usuarios
                    (nombre, apellido, fecha_nacimiento, telefono, genero, pais, usuario_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    perfilUsuario.nombre,
                    perfilUsuario.apellido,
                    perfilUsuario.fecha_nacimiento,
                    perfilUsuario.telefono,
                    perfilUsuario.genero,
                    perfilUsuario.pais,
                    usuario_id
                ]
            );

            const payload = {
                id: rows[0].id,
                usuario: usuario.usuario,
                email: usuario.email,
                rol_id,
                activo: true
            };

            const token = createAccessToken(payload);

            await client.query('COMMIT');

            return token;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release(); // ✅ devuelve la conexión al pool
        }
    },

    changePassword: async (email, usuario, password, newPassword) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const { rows } = await client.query(
                `SELECT id, password FROM tblUsuarios WHERE email = $1 OR usuario = $2`,
                [email, usuario]
            );

            if (rows.length === 0) throw new Error(ERROR_MESSAGES.NO_ENCONTRADO('correo o usuario'));

            const esCorrecta = await bcrypt.compare(password, rows[0].password);
            if (!esCorrecta) throw new Error(ERROR_MESSAGES.CREDENCIALES_INCORRECTAS);

            const salt = await bcrypt.genSalt(10);
            const newHashedPassword = await bcrypt.hash(newPassword, salt);

            await client.query(
                `UPDATE tblUsuarios SET password = $1 WHERE id = $2`,
                [newHashedPassword, rows[0].id]
            );

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

};

export default AuthModel;