import cron from 'node-cron';
import LogModel from "../../models/auth/Log.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';
import { SUCCESS_MESSAGES } from '../../constants/success/successMessages.js';

// Elimina logs con más de 90 días de antigüedad cada día a las 3:00 AM
cron.schedule('0 3 * * *', async () => {
    await LogModel.deleteOldLogs(90);
});

export const getLogs = asyncHandler(async (req, res) => {
    const { limit = 100, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const logs = await LogModel.getAll(Number(limit), Number(offset));
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params
    const logs = await LogModel.getByUserId(id);
    return res.status(200).json({
        success: true,
        data: logs
    })
})

export const getLogsByDate = asyncHandler(async (req, res) => {
    const { date } = req.params
    const logs = await LogModel.getByDate(date);
    return res.status(200).json({
        success: true,
        data: logs
    })
})



export const getLogById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const log = await LogModel.getById(id);
    return res.status(200).json({
        success: true,
        data: log
    })
})

export const getLogsByNivel = asyncHandler(async (req, res) => {
    const { nivel } = req.params;
    const logs = await LogModel.getByNivel(nivel);
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsByRuta = asyncHandler(async (req, res) => {
    const { ruta } = req.query;
    const logs = await LogModel.getByRuta(ruta);
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsByDateRange = asyncHandler(async (req, res) => {
    const { desde, hasta } = req.query;
    const logs = await LogModel.getByDateRange(desde, hasta);
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsByStatusCode = asyncHandler(async (req, res) => {
    const { status } = req.params;
    const logs = await LogModel.getByStatusCode(status);
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsStats = asyncHandler(async (req, res) => {
    const stats = await LogModel.getStats();
    return res.status(200).json({ success: true, data: stats });
});

export const deleteLogsByDateRange = asyncHandler(async (req, res) => {
    const { desde, hasta } = req.query;
    const eliminados = await LogModel.deleteByDateRange(desde, hasta);

    if (!eliminados) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('logs en ese rango')
        });
    }

    return res.status(200).json({
        success: true,
        message: `Logs eliminados correctamente`
    });
});

export const deleteAllLogs = asyncHandler(async (req, res) => {
    await LogModel.deleteAll();
    return res.status(200).json({
        success: true,
        message: 'Todos los logs han sido eliminados'
    });
});

export const deleteLog = asyncHandler(async (req, res) => {
    const { id } = req.params
    const eliminado = await LogModel.delete(id);

    if (!eliminado) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('log')
        });
    }

    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.ROL_ELIMINADO,
    });
})
