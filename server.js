var serverJira = 'jira.atlassian.com';

const http = require('http');
const https = require('https');

var auth = {};

var express = require('express'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	bodyParser = require('body-parser');

var app = express();
app.use(express.static(__dirname));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Passport session setup.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use('local-signin', new LocalStrategy({
		passReqToCallback: true
	},

	function(req, username, password, done) {
		var options = {
			method: 'GET',
			host: serverJira,
			path: '/rest/api/2/permissions',
			headers: {
				'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
			}
		};

		var request = https.request(options, function(data, response) {
			console.log(data.statusCode + ': ' + data.statusMessage);
			if (data.statusCode == 200) {
				console.log('succesfully logged in, session:', data.session);
				var session = data.session;
				auth.user = username;
				auth.password = password;
			} else {
				console.log('Login falhou :(');
			}
		});

		request.end();
	}
));

app.get('/issues/:query', function(req, res) {
	var aaa = {
		protocol: 'https:',
		method: 'GET',
		host: serverJira,
		path: '/rest/api/2/search?jql=' + req.params.query,
	};

	console.log(aaa.protocol);
	console.log(aaa.method);
	console.log(aaa.host);
	console.log(aaa.path);

	var request = https.request(aaa, (respJira) => {
		var dados = '';

		respJira.on('data', (d) => {
			dados += d;
		});

		respJira.on('end', () => {
			res.writeHead(200, {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			});

			res.end(dados);
		});
	});

	request.end();
});

app.get('/config/:user', function(req, res) {
	//TODO
});

app.put('/config/:user', function(req, res) {
	//TODO
});

app.delete('/config/:user', function(req, res) {
	//TODO
});

app.post('/login', passport.authenticate('local-signin', {
	successRedirect: '/kanban.html',
	failureRedirect: '/Login.html?msg=Usuário/senha+inválidos',
}));

var server = app.listen(8081, function() {});
