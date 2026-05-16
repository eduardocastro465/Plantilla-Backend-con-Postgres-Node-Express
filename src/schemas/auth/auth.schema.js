import { z } from 'zod';
import { SCHEMA_ERRORS } from '../../constants/errors/errorSchemas.errors.js';

const passwordSchema = z.string({ required_error: SCHEMA_ERRORS.PASSWORD_REQUERIDO })
    .min(8, SCHEMA_ERRORS.PASSWORD_MIN(8))
    .max(50, SCHEMA_ERRORS.PASSWORD_MAX(50))
    .regex(/[A-Z]/, SCHEMA_ERRORS.PASSWORD_MAYUSCULA)
    .regex(/[a-z]/, SCHEMA_ERRORS.PASSWORD_MINUSCULA)
    .regex(/[0-9]/, SCHEMA_ERRORS.PASSWORD_NUMERO)
    .regex(/[^A-Za-z0-9]/, SCHEMA_ERRORS.PASSWORD_SIMBOLO);

const emailSchema = z.email({ required_error: SCHEMA_ERRORS.EMAIL_REQUERIDO })
    .min(5, SCHEMA_ERRORS.EMAIL_MIN(5))
    .max(100, SCHEMA_ERRORS.EMAIL_MAX(100));

export const registerSchema = z.object({
    usuario: z.object({
        usuario: z.string({ required_error: SCHEMA_ERRORS.USUARIO_REQUERIDO })
            .min(3, SCHEMA_ERRORS.USUARIO_MIN(3))
            .max(30, SCHEMA_ERRORS.USUARIO_MAX(30)),
        email: emailSchema,
        password: passwordSchema,
    }),
    perfilUsuario: z.object({
        nombre: z.string({ required_error: SCHEMA_ERRORS.NOMBRE_REQUERIDO })
            .min(3, SCHEMA_ERRORS.NOMBRE_MIN(3))
            .max(30, SCHEMA_ERRORS.NOMBRE_MAX(30)),
        apellido: z.string({ required_error: SCHEMA_ERRORS.APELLIDO_REQUERIDO })
            .min(3, SCHEMA_ERRORS.APELLIDO_MIN(3))
            .max(50, SCHEMA_ERRORS.APELLIDO_MAX(50)),
        telefono: z.string({ required_error: SCHEMA_ERRORS.TELEFONO_REQUERIDO })
            .regex(/^[0-9]{8,20}$/, SCHEMA_ERRORS.TELEFONO_FORMATO)
            .optional(),
        genero: z.string({ required_error: SCHEMA_ERRORS.GENERO_REQUERIDO })
            .min(3, SCHEMA_ERRORS.GENERO_MIN(3))
            .max(30, SCHEMA_ERRORS.GENERO_MAX(30))
            .optional(),
        fecha_nacimiento: z.date({ required_error: SCHEMA_ERRORS.FECHA_NACIMIENTO_REQUERIDO }),
        pais: z.string({ required_error: SCHEMA_ERRORS.PAIS_REQUERIDO })
            .min(3, SCHEMA_ERRORS.PAIS_MIN(3))
            .max(60, SCHEMA_ERRORS.PAIS_MAX(60))
            .optional(),
    }).optional()
}).strict();

export const loginSchema = z.object({
    email: emailSchema.optional(),
    usuario: z.string()
        .min(3, SCHEMA_ERRORS.USUARIO_MIN(3))
        .max(30, SCHEMA_ERRORS.USUARIO_MAX(30))
        .optional(),
    password: passwordSchema,
}).refine(data => data.email || data.usuario, {
    message: SCHEMA_ERRORS.EMAIL_O_USUARIO_REQUERIDO,
    path: ['email']
});

export const cambiarContrasenaSchema = z.object({
    email: emailSchema.optional(),
    usuario: z.string()
        .min(3, SCHEMA_ERRORS.USUARIO_MIN(3))
        .max(30, SCHEMA_ERRORS.USUARIO_MAX(30))
        .optional(),
    password: z.string({ required_error: SCHEMA_ERRORS.PASSWORD_ACTUAL_REQUERIDO })
        .min(8, SCHEMA_ERRORS.PASSWORD_MIN(8))
        .max(50, SCHEMA_ERRORS.PASSWORD_MAX(50)),
    newPassword: z.string({ required_error: SCHEMA_ERRORS.PASSWORD_NUEVA_REQUERIDO })
        .min(8, SCHEMA_ERRORS.PASSWORD_MIN(8))
        .max(50, SCHEMA_ERRORS.PASSWORD_MAX(50))
        .regex(/[A-Z]/, SCHEMA_ERRORS.PASSWORD_MAYUSCULA)
        .regex(/[a-z]/, SCHEMA_ERRORS.PASSWORD_MINUSCULA)
        .regex(/[0-9]/, SCHEMA_ERRORS.PASSWORD_NUMERO)
        .regex(/[^A-Za-z0-9]/, SCHEMA_ERRORS.PASSWORD_SIMBOLO),
}).refine(data => data.email || data.usuario, {
    message: SCHEMA_ERRORS.EMAIL_O_USUARIO_REQUERIDO,
    path: ['email']
}).refine(data => data.password !== data.newPassword, {
    message: SCHEMA_ERRORS.PASSWORD_DIFERENTE,
    path: ['newPassword']
});

export const enviarCodigoEmailSchema = z.object({
    email: emailSchema,
});

export const verificarCodigoEmailSchema = z.object({
    email: emailSchema,
    codigo: z.string({ error: SCHEMA_ERRORS.CODIGO_REQUERIDO })
        .length(6, SCHEMA_ERRORS.CODIGO_LENGTH(6))
        .regex(/^[0-9]+$/, SCHEMA_ERRORS.CODIGO_SOLO_NUMEROS),
});