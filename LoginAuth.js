var express = require ('express');
var path = require ('path');
var cookieParser = require ('cookie-parser');
var bodyParser = require ('body-parser');
var expressHandlebars = require ('express-handlebars');
var expressValidator = require ('express-validator');
var flash = require ('connect-flash');
var session = require ('express-session');
var passport = require ('passport');
var LocalStrategy = require ('passport-local').Strategy;
var mongo = require ('mongodb');
var mongoose = require ('mongoose');
mongoose.connect ('mongodb://localhost/loginApp', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;

var routes = require ('./routes/dashb');
var users = require ('./routes/users');

// Initialize app
var app = express ();

// View Engine
app.set ('views', path.join(__dirname, 'views'));
app.engine ('handlebars', expressHandlebars({defaultLayout:'layout'}));
app.set ('view engine', '.handlebars');

// BodyParser Middleware
app.use (bodyParser.json());
app.use (bodyParser.urlencoded ({ extended:false }));
app.use (cookieParser());

// Set static folder
app.use (express.static (path.join (__dirname, 'public')));

// Express session
app.use (session ({
	secret: 'itssecret',
	saveUninitialized: true,
	resave: true
}));

// Passport initialization
app.use (passport.initialize());
app.use (passport.session());

// Express validator
app.use (expressValidator ({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split ('.'),
		root = namespace.shift (),
		formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// Connect flash
app.use (flash());

// Global variables for flash messages
app.use (function (req, res, next) {
	res.locals.success_msg = req.flash ('success_msg');
	res.locals.error_msg = req.flash ('error_msg');
	res.locals.error = req.flash ('error');
	res.locals.user = req.user || null;			
	next();
});

app.use ('/', routes);
app.use ('/users', users);

app.listen (3002, () => console.log ('Listening at port 3002...'));