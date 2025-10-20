const express = require('express');
const app = express();

const cursoRoutes = require('./routes/cursoRoutes');
const alunoRoutes = require('./routes/alunoRoutes');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Alunos e Cursos');
});

app.use('/cursos', cursoRoutes);
app.use('/alunos', alunoRoutes);

module.exports = app;
