// middlewares/errorHandler.middleware.js
import { modoProduction } from "../config.js";
import { ERROR_MESSAGES } from "../constants/errors/errorMessages.erros.js";
import { logError } from '../utils/logger.js';

function getStatus(error) {
    if (error.status) return error.status;
    if (error.name === 'JsonWebTokenError') return 401;
    if (error.message === ERROR_MESSAGES.CREDENCIALES_INCORRECTAS) return 401;
    if (error.message?.includes(ERROR_MESSAGES.USUARIO_DESACTIVADO)) return 401;
    return 500;
}

export const errorHandler = (error, req, res, next) => {

    const status = getStatus(error);

    if (!modoProduction) {
        console.error({
            status: 'Error',
            mensaje: error.message,
            ruta: req.originalUrl,
            metodo: req.method
        });
    }

    // Guardar en log (pasa el error y el req)
    logError(error, req);

    res.status(status).json({
        success: false,
        message: error.message || ERROR_MESSAGES.ERROR_INTERNO
    });
};

export const jsonErrorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        const error = new Error(`JSON inválido: ${err.message}`);
        error.status = 400;
        return next(error);
    }
    next(err);
};