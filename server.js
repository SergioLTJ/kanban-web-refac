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
    return done(null, false, { message: 'Erro' });
    //http.post(serverJira + "/jira/rest/auth/1/session", loginArgs, function(data, response) {
    //  if (response.statusCode == 200) {
    //    console.log('succesfully logged in, session:', data.session);
    //    var session = data.session;
    //  } else {
    //    throw "Login failed :(";
    //  }
    //});
  }
));

app.get('/issues/:query', function(req, res) {
  https.get(serverJira + '/rest/api/2/search?jql=' + req.params.query, (respJira) => {
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
