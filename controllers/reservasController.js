// controllers/reservasController.js
const Agenda = require('../models/Agenda');

exports.agendar = async (req, res) => {
    try {
        const { tema, fecha, hora, tutor, pago, solicitud_id } = req.body;

        if (!tema || !fecha || !hora || !tutor || !pago || !solicitud_id) {
            return res.status(400).json({ success: false, error: "missing_fields" });
        }

        const userData = {
            id: req.user?.id,
            name: req.user?.name,
            lastname: req.user?.lastname,
            email: req.user?.email,
            program: req.user?.program,
        };

        if (!userData.id) {
            return res.status(401).json({ success: false, error: "user_not_authenticated" });
        }

        // Verificar si el usuario ya ha agendado esta solicitud
        const existingAgenda = await Agenda.verificarAgendamiento(userData.email, tema, fecha, hora);

        if (existingAgenda.length > 0) {
            return res.json({ success: false, error: "already_scheduled" });
        }

        // Crear agendamiento
        await Agenda.crearAgendamiento(userData, tema, fecha, hora, tutor, pago, solicitud_id);

        res.json({ success: true });
    } catch (error) {
        console.error("Error al agendar:", error);
        res.status(500).json({ success: false, error: "error_scheduling" });
    }
};

exports.getAgendasPublicacion = async (req, res) => {
  const { solicitud_id } = req.params;
  try {
      const agendas = await Publicacion.getAgendasPorSolicitud(solicitud_id);
      res.json(agendas);
  } catch (error) {
      console.error("Error al obtener las agendas de la publicación:", error);
      res.status(500).send("Error al obtener las agendas de la publicación");
  }
};