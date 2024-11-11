const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const indexRouter = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reservasRoutes = require("./routes/reservasRoutes");
const passport = require('passport');
const initializePassport = require('./passportConfig'); // Asegúrate de que la ruta sea correcta
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

initializePassport(passport); // Llama correctamente a initializePassport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


app.use('/', indexRouter);
app.use('/users', authRoutes);
app.use('/', dashboardRoutes);
app.use('/dashboard', dashboardRoutes);
app.use("/reservas", reservasRoutes);
app.use('/users', dashboardRoutes);
app.use("/api", dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
