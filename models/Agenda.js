// models/Agenda.js
const pool = require('../dbConfig');

const Agenda = {
    verificarAgendamiento: async (email, tema, fecha, hora) => {
        const checkQuery = `SELECT * FROM agendas WHERE user_data->>'email' = $1 AND tema = $2 AND fecha = $3 AND hora = $4`;
        const result = await pool.query(checkQuery, [email, tema, fecha, hora]);
        return result.rows;
    },

    crearAgendamiento: async (userData, tema, fecha, hora, tutor, pago, solicitud_id) => {
        const insertQuery = `INSERT INTO agendas (user_data, tema, fecha, hora, tutor, pago, solicitud_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        await pool.query(insertQuery, [userData, tema, fecha, hora, tutor, pago, solicitud_id]);
    }
};

module.exports = Agenda;
