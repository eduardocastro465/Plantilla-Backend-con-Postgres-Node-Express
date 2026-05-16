import rateLimit from 'express-rate-limit';
import { ERROR_MESSAGES } from "../constants/errors/errorMessages.erros.js";

// Limitador general para evitar abuso en rutas públicas
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 peticiones por ventana de 15 minutos por IP
  message: {
    success: false,
    message: ERROR_MESSAGES.DEMASIADAS_PETICIONES
  },
  standardHeaders: true, // Retorna la información en las cabeceras `RateLimit-*`
  legacyHeaders: false, // Desactiva las cabeceras `X-RateLimit-*`
});

// Limitador más estricto para rutas de autenticación (login, registro)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Limitar a 10 intentos fallidos/peticiones por hora por IP
  message: {
    success: false,
    message: ERROR_MESSAGES.DEMASIADOS_INTENTOS_AUTH
  },
  standardHeaders: true,
  legacyHeaders: false,
});
