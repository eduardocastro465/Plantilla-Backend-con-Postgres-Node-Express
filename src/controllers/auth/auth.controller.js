import AuthModel from '../../models/auth/Auth.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ERROR_MESSAGES } from '../../constants/errorMessages.js';
import { SUCCESS_MESSAGES } from '../../constants/successMessages.js';
import { modoProduction } from '../../config.js';


export const verificarPermisos = asyncHandler(async (req, res) => {
    const { rol_id } = req.user;

    const rol = await AuthModel.comprobarPermisos(rol_id);
    res.status(200).json({
        success: true,
        data: rol,
    });
});

export const register = asyncHandler(async (req, res) => {
    const { usuario, perfilUsuario } = req.body;

    const token = await AuthModel.register(usuario, perfilUsuario);
    res.cookie('token', token, {
        httpOnly: true,
        secure: modoProduction,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    });

    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.REGISTRO_EXITOSO,
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, usuario, password } = req.body;

    const token = await AuthModel.login(email, usuario, password);

    res.cookie('token', token, {
        httpOnly: true,
        secure: modoProduction,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    });

    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_EXITOSO,
    });
});

export const cambiarContrasena = asyncHandler(async (req, res) => {
    const { email, usuario, password, newPassword } = req.body;

    await AuthModel.changePassword(email, usuario, password, newPassword);
    res.status(201).json({
        success: true,
        message: SUCCESS_MESSAGES.CONTRASENA_CAMBIADA,
    });
});

export const logout = asyncHandler(async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: ERROR_MESSAGES.TOKEN_NO_PROPORCIONADO
        });
    }

    res.cookie('token', '', {
        httpOnly: true,
        secure: modoProduction,
        sameSite: 'strict',
        expires: new Date(0),
        path: '/'
    });

    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGOUT_EXITOSO,
    });
});
