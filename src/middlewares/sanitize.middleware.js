import sanitize from 'sanitize-html';

const sanitizarValor = (valor) => {
    if (typeof valor === 'string') {
        return sanitize(valor, { allowedTags: [] }).trim();
    }
    if (typeof valor === 'object' && valor !== null) {
        return sanitizarBody(valor); // recursivo para objetos anidados
    }
    return valor;
};

const sanitizarBody = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, sanitizarValor(value)])
    );
};

export const sanitizeHtml = (req, res, next) => {
    if (req.body) {
        req.body = sanitizarBody(req.body);
    }
    next();
};