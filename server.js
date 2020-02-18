const express = require('express');
const nunjucks = require('nunjucks');
const Pool = require('pg').Pool;

const server = express();

server.use(express.static('public'));

server.use(express.urlencoded({ extended: true }));

nunjucks.configure('./', {
  express: server,
  noChace: true,
});

const db = new Pool({
  user: 'postgres',
  password: 'docker',
  host: 'localhost',
  port: 5432,
  database: 'doe'
});

const donnors = [];

server.get('/', (req, res) => {
  db.query("SELECT * FROM donnors", (err, result) => {
    if (err) return res.send("Erro no Banco de Dados");

    const donnors = result.rows;
    return res.render('index.html', { donnors });
  })
  
})

server.post('/', (req, res) => {
  const {name, email, blood} = req.body;

  if (!name || !email || !blood) {
    return res.send('Todos os campos são obrigatórios.');
  }

  const query = `
    INSERT INTO donnors ("name", "email", "blood")
    VALUES ($1, $2, $3)`;

  const values = [name, email, blood];

  db.query(query, values, (err) => {
    if (err) return res.send("Erro no Banco de Dados.");
    
    return res.redirect('/');
  });

  
})

server.listen(3000);