// perfil_usuarios.controller.js
import PerfilUsuarioModel from '../../models/user/PerfilUsuario.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';
import { SUCCESS_MESSAGES } from '../../constants/success/successMessages.js';

export const getAllPerfiles = asyncHandler(async (req, res) => {
    const perfiles = await PerfilUsuarioModel.getAll();
    res.status(200).json({
        success: true,
        data: perfiles
    });
});

export const getPerfilById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const perfil = await PerfilUsuarioModel.getById(id);
    if (!perfil) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('perfil')
        });
    }
    res.status(200).json({
        success: true,
        data: perfil
    });
});

export const getPerfilByUsuarioId = asyncHandler(async (req, res) => {
    const { usuario_id } = req.params;
    const perfil = await PerfilUsuarioModel.getByUsuarioId(usuario_id);
    if (!perfil) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('perfil')
        });
    }
    res.status(200).json({
        success: true,
        data: perfil
    });
});

export const crearPerfil = asyncHandler(async (req, res) => {
    const { usuario_id } = req.params;
    const { nombre, apellido, edad, telefono } = req.body;

    const existePerfil = await PerfilUsuarioModel.getByUsuarioId(usuario_id);
    if (existePerfil) {
        return res.status(409).json({
            success: false,
            message: ERROR_MESSAGES.YA_EXISTE('perfil')
        });
    }

    const id = await PerfilUsuarioModel.create(usuario_id, { nombre, apellido, edad, telefono });
    res.status(201).json({
        success: true,
        message: SUCCESS_MESSAGES.PERFIL_CREADO,
        data: { id }
    });
});

export const actualizarPerfil = asyncHandler(async (req, res) => {
    const { usuario_id } = req.params;
    const { nombre, apellido, edad, telefono } = req.body;

    const existe = await PerfilUsuarioModel.getByUsuarioId(usuario_id);
    if (!existe) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('perfil')
        });
    }

    await PerfilUsuarioModel.update(usuario_id, { nombre, apellido, edad, telefono });
    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.PERFIL_ACTUALIZADO
    });
});

export const eliminarPerfil = asyncHandler(async (req, res) => {
    const { usuario_id } = req.params;

    const existe = await PerfilUsuarioModel.getByUsuarioId(usuario_id);
    if (!existe) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('perfil')
        });
    }

    await PerfilUsuarioModel.delete(usuario_id);
    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.PERFIL_ELIMINADO
    });
});