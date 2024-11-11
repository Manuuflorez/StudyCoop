const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.showDashboard);
router.get('/dashboard', dashboardController.dashboardPage);
router.get('/api/ultimas-ofrecer', dashboardController.getUltimasOfrecer);
router.get('/api/ultimas-solicitudes', dashboardController.getUltimasSolicitudes);
router.post('/publicar', dashboardController.postPublicacion);
router.get('/', dashboardController.getDashboard);
router.get('/api/publicaciones', dashboardController.obtenerPublicacionesPorCategoria);
router.get('/search', dashboardController.searchPublicaciones);
router.get("/users/reservas/:id", dashboardController.getReserva);
router.get('/profile', dashboardController.getProfile);
router.get('/api/publicaciones-usuario/:id', dashboardController.getPublicacionesUsuario);
router.get('/api/agendas-publicacion/:user_id', dashboardController.getAgendasPublicacion);
router.post('/api/publicacion/:id', dashboardController.updatePublicacion);
router.delete('/api/eliminar-publicacion/:id', dashboardController.deletePublicacion);

module.exports = router;
