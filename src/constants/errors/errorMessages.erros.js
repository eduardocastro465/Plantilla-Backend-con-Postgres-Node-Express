export const ERROR_MESSAGES = {
  // Auth
  TOKEN_NO_PROPORCIONADO: 'Debes iniciar sesión para continuar',
  TOKEN_INVALIDO: 'Tu sesión no es válida, inicia sesión nuevamente',
  TOKEN_EXPIRADO: 'Tu sesión ha expirado, inicia sesión nuevamente',

  // Roles
  SIN_ROL: 'Tu cuenta no tiene un rol asignado, contacta al administrador',
  SIN_PERMISO: 'No tienes permiso para realizar esta acción',

  // Correo
  CORREO_NO_ENVIADO: 'No se pudo enviar el correo, intenta de nuevo',
  CODIGO_INVALIDO: 'El código es inválido o ha expirado',

  // Auth general
  CREDENCIALES_INCORRECTAS: 'Credenciales incorrectas',
  USUARIO_DESACTIVADO: 'Tu cuenta está desactivada, contacta al administrador',
  CONTRASENA_INCORRECTA: 'La contraseña actual es incorrecta',

  // Dinámicos
  YA_EXISTE: (campo) => `El ${campo} ya está en uso`,
  NO_EXISTE: (campo) => `El ${campo} no existe`,
  NO_ENCONTRADO: (campo) => `El ${campo} no fue encontrado`,
  NO_ACTUALIZADO: (campo) => `El ${campo} no fue actualizado`,
  NO_ELIMINADO: (campo) => `El ${campo} no fue eliminado`,

  // Base de datos
  ERROR_CONSULTA: 'Error al consultar la base de datos',
  ERROR_TRANSACCION: 'Error al procesar la transacción',

  // Servidor
  RUTA_NO_ENCONTRADA: 'Ruta no encontrada',
  ERROR_INTERNO: 'Ocurrió un error inesperado, intenta más tarde',
  SERVICIO_NO_DISPONIBLE: 'El servicio no está disponible, intenta más tarde',
  
  // Rate Limit
  DEMASIADAS_PETICIONES: 'Demasiadas peticiones desde esta IP, por favor intenta nuevamente después de 15 minutos.',
  DEMASIADOS_INTENTOS_AUTH: 'Demasiados intentos de autenticación, por favor intenta de nuevo después de 1 hora.',
};