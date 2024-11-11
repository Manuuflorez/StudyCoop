const express = require("express");
const router = express.Router();
const reservasController = require("../controllers/reservasController");

// Ruta para manejar la solicitud de agendar
router.post("/agendar", reservasController.agendar);

module.exports = router;
