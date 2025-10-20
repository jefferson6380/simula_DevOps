const db = require('../database/db');

const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM alunos ORDER BY id ASC');
  return rows;
};

const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM alunos WHERE id = $1', [id]);
  return rows[0];
};

const create = async (aluno) => {
  const { nome, email, curso_id } = aluno;
  const { rows } = await db.query(
    'INSERT INTO alunos (nome, email, curso_id) VALUES ($1, $2, $3) RETURNING *',
    [nome, email, curso_id]
  );
  return rows[0];
};

const update = async (id, aluno) => {
  const { nome, email, curso_id } = aluno;
  const { rows } = await db.query(
    'UPDATE alunos SET nome = $1, email = $2, curso_id = $3 WHERE id = $4 RETURNING *',
    [nome, email, curso_id, id]
  );
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM alunos WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = { findAll, findById, create, update, remove };
