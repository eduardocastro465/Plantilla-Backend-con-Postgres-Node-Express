import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { autorizar } from '../../middlewares/auth.middleware.js';
import { ROLES_TODOS } from '../../constants/roles.js';
import { loginSchema, registerSchema, cambiarContrasenaSchema, enviarCodigoEmailSchema, verificarCodigoEmailSchema } from '../../schemas/auth/auth.schema.js';
import { login, register, logout, cambiarContrasena, enviarCodigoEmail, verificarCodigoEmail, } from '../../controllers/auth/auth.controller.js';
import { authLimiter } from '../../middlewares/rateLimit.middleware.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/register/enviarCodigoEmail', authLimiter, validate(enviarCodigoEmailSchema), enviarCodigoEmail);
router.post('/register/verificarCodigoEmail', authLimiter, validate(verificarCodigoEmailSchema), verificarCodigoEmail);
router.put('/cambiar-contrasena', verifyToken, autorizar(ROLES_TODOS), validate(cambiarContrasenaSchema), cambiarContrasena);
router.post('/logout', verifyToken, autorizar(ROLES_TODOS), logout);

export default router;