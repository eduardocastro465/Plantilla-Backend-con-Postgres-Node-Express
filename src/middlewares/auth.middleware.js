import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config.js";
import { asyncHandler, throwError } from '../utils/asyncHandler.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
import AuthModel from '../models/auth/Auth.model.js';


export const verifyToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || req.cookies?.token;

    console.log(token)

    if (!token) {
        throwError(ERROR_MESSAGES.NO_ENCONTRADO('token'), 401);
    }

    const decodedToken = jwt.verify(token, TOKEN_SECRET);
    req.user = decodedToken;

    if (!decodedToken.activo) {
        throwError(ERROR_MESSAGES.USUARIO_INACTIVO, 401);
    }

    next();
});

export const autorizar = (...rolesPermitidos) => {
    return asyncHandler(async (req, res, next) => {
        console.log(req.user)

        if (!req.user.rol_id) {
            throwError(ERROR_MESSAGES.SIN_ROL, 401);
        }

        const rol = await AuthModel.comprobarPermisos(req.user.rol_id);

        if (!rolesPermitidos.includes(rol.id)) {
            throwError(ERROR_MESSAGES.NO_TIENES_PERMISO, 403);
        }

        next();
    });
};


/*          verifyToken - Middleware de autenticación

* Requiere token JWT en el header Authorization
* Formato: Bearer <token>
ejemplos -->

* 📌 EJEMPLOS DE USO:
 * 
  Fetch
 * fetch('/api/usuarios', {
 *     headers: { 'Authorization': `Bearer ${token}` }
 * })
 * 
  Axios
 * axios.get('/api/usuarios', {
 *     headers: { 'Authorization': `Bearer ${token}` }
 * })
 * 
*/