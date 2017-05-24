var serverJira = 'https://jira.atlassian.com';

const http = require('http');
const https = require('https');

var express = require('express'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  bodyParser = require('body-parser');

var app = express();
app.use(express.static(__dirname));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }));
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
    console.log('Oi, eu cheguei aqui');    
	
	var dados = {
		"username": username,
		"password": password
	};
	
	var options = {
		method: 'POST',
		host: 'jira.senior.com.br',
		path: '/jira/rest/auth/1/session',
	};
	
    var request = https.request(options, function(data, response) {
		console.log(data);
      if (response.statusCode == 200) {
        console.log('succesfully logged in, session:', data.session);
        var session = data.session;
      } else {
        throw "Login failed :(";
      }
    });
	
	request.on('uncaughtException', function (err) {
		console.log(err);
	}); 
	
	request.write(JSON.stringify(dados));
	request.end();
  }
));

app.get('/issues/:query', function(req, res) {
  var options = {
    auth: 'sergio.tomio:456123@Capivara',
    host: 'jira.senior.com.br',
    path: '/rest/api/2/search?jql=' + req.params.query,
  };
	
  https.request(options, (respJira) => {
    var dados = '';

    respJira.on('data', (d) => {
      dados += d;
    });

    respJira.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      });

      res.end(dados);
    });
  });
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
