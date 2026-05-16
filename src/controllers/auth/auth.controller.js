import AuthModel from '../../models/auth/Auth.model.js';
import { asyncHandler, throwError } from '../../utils/asyncHandler.js';
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';
import { SUCCESS_MESSAGES } from '../../constants/success/successMessages.js';
import { modoProduction } from '../../config.js';
import { generarCodigo, sendEmail } from "../../services/email.js";


export const verificarPermisos = asyncHandler(async (req, res) => {
    const { rol_id } = req.user;

    const rol = await AuthModel.comprobarPermisos(rol_id);
    res.status(200).json({
        success: true,
        data: rol,
    });
});

export const enviarCodigoEmail = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const codigo = generarCodigo();

    const minutos = 10;
    const expira_en = new Date(Date.now() + minutos * 60 * 1000);

    await AuthModel.guardarCodigoCorreo(email, codigo, expira_en)
    await sendEmail(email, codigo);

    return res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.Codigo_Enviado,
    })

})

export const verificarCodigoEmail = asyncHandler(async (req, res) => {

    const { email, codigo } = req.body;


    const codigoVerificado = await AuthModel.verificarCodigoCorreo(email, codigo);

    if (!codigoVerificado) throwError(ERROR_MESSAGES.CODIGO_INVALIDO, 400);

    await AuthModel.marcarCodigoUsado(codigoVerificado.id);

    return res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.Codigo_Verificado,
    });
})

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
