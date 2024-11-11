// models/Publicacion.js
const pool = require('../dbConfig');

const Publicacion = {
    getAllSolicitudes: async () => {
        const result = await pool.query('SELECT * FROM solicitudes ORDER BY fecha_solicitud DESC LIMIT 7');
        return result.rows;
    },

    getUltimasOfrecer: async () => {
        const result = await pool.query(`SELECT * FROM solicitudes WHERE tipo_servicio = 'ofrecer' ORDER BY fecha_reunion DESC LIMIT 5`);
        return result.rows;
    },

    getUltimasSolicitudes: async () => {
        const result = await pool.query(`SELECT * FROM solicitudes WHERE tipo_servicio = 'solicitar' ORDER BY fecha_reunion DESC LIMIT 5`);
        return result.rows;
    },

    createPublicacion: async (userData, tipo, materia, tema, fecha, hora) => {
        await pool.query(
            `INSERT INTO solicitudes (user_data, tipo_servicio, materia, tema_interes, fecha_reunion, hora) VALUES ($1, $2, $3, $4, $5, $6)`,
            [userData, tipo, materia, tema, fecha, hora]
        );
    },

    searchPublicaciones: async (query, tipo) => {
        const result = await pool.query(
            `SELECT * FROM solicitudes WHERE (materia ILIKE $1 OR tema_interes ILIKE $1) AND tipo_servicio = $2 ORDER BY fecha_reunion DESC`,
            [`%${query}%`, tipo]
        );
        return result.rows;
    },

    
    getPublicacionesPorCategoria: async (categoria) => {
        const result = await pool.query(
            'SELECT * FROM solicitudes WHERE materia = $1 ORDER BY fecha_reunion DESC LIMIT 5',
            [categoria]
        );
        return result.rows;
    },

    updatePublicacion: async (publicacionId, tipo, materia, tema, fecha, userData) => {
        await pool.query(
            "UPDATE solicitudes SET tipo_servicio = $1, materia = $2, tema_interes = $3, fecha_reunion = $4, user_data = $5 WHERE solicitud_id = $6",
            [tipo, materia, tema, fecha, userData, publicacionId]
        );
    },

    deletePublicacion: async (publicacionId) => {
        const result = await pool.query('DELETE FROM solicitudes WHERE solicitud_id = $1', [publicacionId]);
        return result.rowCount;
    },

    getReservaById: async (solicitudId) => {
        const result = await pool.query('SELECT * FROM solicitudes WHERE solicitud_id = $1', [solicitudId]);
        return result.rows[0];
    },

    getPublicacionesUsuario: async (userId) => {
        const result = await pool.query("SELECT * FROM solicitudes WHERE user_data ->> 'id' = $1", [userId]);
        return result.rows;
    },

    getAgendasPublicacion: async (user_id) => {
        const result = await pool.query("SELECT * FROM agendas WHERE user_data->>'id' = $1", [user_id]);
        return result.rows;
    },

    getAgendasPorSolicitud: async (solicitud_id) => {
        const result = await pool.query(
            "SELECT user_data FROM agendas WHERE solicitud_id = $1",
            [solicitud_id]
        );
        return result.rows;
    }
};



module.exports = Publicacion;
