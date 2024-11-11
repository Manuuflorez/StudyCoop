const Publicacion = require('../models/Publicacion');

exports.showDashboard = (req, res) => {
    res.render('dashboard', { user: req.user });
};

exports.dashboardPage = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const publicaciones = await Publicacion.getAllSolicitudes();
            const servicios = publicaciones.filter(pub => pub.tipo_servicio === 'ofrecer');
            const solicitudes = publicaciones.filter(pub => pub.tipo_servicio === 'solicitar');
            res.render('dashboard', { publicaciones, servicios, solicitudes });
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
            res.status(500).send('Error al obtener las publicaciones');
        }
    } else {
        res.redirect('/users/login');
    }
};

exports.getUltimasOfrecer = async (req, res) => {
    try {
        const publicaciones = await Publicacion.getUltimasOfrecer();
        res.json(publicaciones);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las publicaciones' });
    }
};

exports.getUltimasSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Publicacion.getUltimasSolicitudes();
        res.json(solicitudes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las solicitudes' });
    }
};

exports.postPublicacion = async (req, res) => {
    const { tipo, materia, tema, fecha, hora } = req.body;
    const usuario_id = req.user.id;

    try {
        await Publicacion.createPublicacion(req.user, tipo, materia, tema, fecha, hora);
        req.flash("success_msg", "Solicitud creada exitosamente");
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error al crear la solicitud:", error);
        req.flash("error_msg", "Error al crear la solicitud");
        res.redirect('/dashboard');
    }
};

exports.searchPublicaciones = async (req, res) => {
    const { query, tipo } = req.query;

    try {
        const publicaciones = await Publicacion.searchPublicaciones(query, tipo);
        res.render('partials/resultadosBusqueda', { publicaciones, layout: false });
    } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
        res.status(500).send('Error al realizar la búsqueda');
    }
};

exports.getReserva = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const solicitud = await Publicacion.getReservaById(req.params.id);
            if (!solicitud) return res.status(404).send('Solicitud no encontrada');
            res.render("reservas", { user: req.user, solicitud });
        } catch (error) {
            console.error('Error fetching solicitud:', error);
            res.status(500).send('Error del servidor');
        }
    } else {
        res.redirect('/users/login');
    }
};

exports.getPublicacionesUsuario = async (req, res) => {
    try {
        const publicaciones = await Publicacion.getPublicacionesUsuario(req.params.id);
        res.json(publicaciones);
    } catch (error) {
        console.error("Error al obtener las solicitudes del usuario:", error);
        res.status(500).json({ error: "Error al obtener las solicitudes del usuario" });
    }
};

exports.getAgendasPublicacion = async (req, res) => {
    try {
        const agendas = await Publicacion.getAgendasPublicacion(req.params.user_id);
        res.json(agendas);
    } catch (err) {
        console.error("Error al obtener las agendas de la publicación:", err);
        res.status(500).send("Error al obtener las agendas de la publicación");
    }
};

exports.updatePublicacion = async (req, res) => {
    const { tipo, materia, tema, fecha, user_data } = req.body;

    try {
        await Publicacion.updatePublicacion(req.params.id, tipo, materia, tema, fecha, user_data);
        res.redirect("/users/profile");
    } catch (error) {
        console.error("Error al actualizar la publicación:", error);
        res.status(500).json({ error: "Error al actualizar la publicación" });
    }
};

exports.deletePublicacion = async (req, res) => {
    try {
        const deleted = await Publicacion.deletePublicacion(req.params.id);
        if (deleted === 0) return res.status(404).json({ message: 'La publicación no se encontró o ya ha sido eliminada' });
        res.json({ message: 'Publicación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        res.status(500).json({ error: 'Error al eliminar la publicación' });
    }
};

exports.getProfile = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('profile', { user: req.user });
    } else {
        res.redirect('/users/login');
    }
};

exports.obtenerPublicacionesPorCategoria = async (req, res) => {
    const { categoria } = req.query; // Obtiene el parámetro de la consulta
    try {
        const publicaciones = await PublicacionModel.getPublicacionesPorCategoria(categoria);
        res.json(publicaciones);
    } catch (error) {
        console.error('Error al obtener publicaciones por categoría:', error);
        res.status(500).json({ message: 'Error al obtener publicaciones por categoría' });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const publicaciones = await PublicacionModel.getAllPublicaciones();
        res.render('dashboard', { user: req.user, publicaciones });
    } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
        req.flash("error_msg", "Error al cargar las publicaciones");
        res.redirect('/dashboard');
    }
};