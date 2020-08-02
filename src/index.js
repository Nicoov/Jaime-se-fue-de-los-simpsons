const express = require("express");
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

//initialzations 
const app = express();
require('./lib/passport');

// settings 
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), // path join permite unir directorios 
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// middlewares 
app.use(session({
    secret: 'mysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)

}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// global variables 

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next(); // esta funcion toma la informacion del usuario(req), toma lo que el servidor quiera responder (res), finalmente para conitnuiar con el codigo (next)
});


// routes *se definen las rutas donde el usuario va a navegar*
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


//public
app.use(express.static(path.join(__dirname, 'public')));

//starting the server 

app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});