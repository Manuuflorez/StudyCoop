const User = require('../models/User');
const passport = require('passport');

// Renderizar la página de registro
exports.registerPage = (req, res) => {
    res.render('register');
};

// Registrar nuevo usuario
exports.registerUser = async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) errors.push({ message: "Por favor completa todos los campos" });
    if (password !== password2) errors.push({ message: "Las contraseñas no coinciden" });
    if (password.length < 6) errors.push({ message: "La contraseña debe tener al menos 6 caracteres" });

    if (errors.length > 0) {
        res.render('register', { errors });
    } else {
        try {
            const user = await User.create(name, email, password);
            req.flash('success_msg', 'Registrado con éxito. Ahora puedes iniciar sesión.');
            res.redirect('/users/login');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).send('Error en el servidor');
        }
    }
};

// Renderizar la página de login
exports.loginPage = (req, res) => {
    res.render('login', { errors: req.flash('error') });
};

// Iniciar sesión
exports.loginUser = passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
});

// Cerrar sesión
exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success_msg', 'Sesión cerrada');
        res.redirect('/users/login');
    });
};
