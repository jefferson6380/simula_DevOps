const db = require('../database/db');

const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM cursos ORDER BY id ASC');
  return rows;
};

const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM cursos WHERE id = $1', [id]);
  return rows[0];
};

const create = async (curso) => {
  const { nome, descricao } = curso;
  const { rows } = await db.query(
    'INSERT INTO cursos (nome, descricao) VALUES ($1, $2) RETURNING *',
    [nome, descricao]
  );
  return rows[0];
};

const update = async (id, curso) => {
  const { nome, descricao } = curso;
  const { rows } = await db.query(
    'UPDATE cursos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *',
    [nome, descricao, id]
  );
  return rows[0];
};

const remove = async (id) => {
  const { rowCount } = await db.query('DELETE FROM cursos WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = { findAll, findById, create, update, remove };
