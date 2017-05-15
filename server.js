const http = require('http');
const https = require('https');

// Create an HTTP server
const srv = http.createServer();

srv.on('request', (req, resp) => {
  var dados = '';
  https.get('https://jira.atlassian.com/rest/api/2/search?jql=project=JSWSERVER+AND+component=AgileBoard&fields=key,summary', (res) => {
    console.log('Iniciando processamento do request.');

    res.on('data', (d) => {
      dados += d;
    });

    res.on('end', () => {
      resp.writeHead(200,
        {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
        });

      console.log('Terminando processamento e enviando resposta.');
      resp.end(dados);
    });
  })
});

// now that server is running
srv.listen(1337, '127.0.0.1', () => {});
