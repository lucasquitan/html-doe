const express = require('express');
const nunjucks = require('nunjucks');
const Pool = require('pg').Pool;
require('dotenv/config');


const server = express();

server.use(express.static('public'));

server.use(express.urlencoded({ extended: true }));

nunjucks.configure('./', {
  express: server,
  noChace: true,
});

const db = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,  
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