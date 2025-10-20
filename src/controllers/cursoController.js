const cursoRepository = require('../repositories/cursoRepository');

const getAllCursos = async (req, res) => {
  try {
    const cursos = await cursoRepository.findAll();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCursoById = async (req, res) => {
  try {
    const curso = await cursoRepository.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }
    res.status(200).json(curso);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCurso = async (req, res) => {
  try {
    const curso = await cursoRepository.create(req.body);
    res.status(201).json(curso);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCurso = async (req, res) => {
  try {
    const curso = await cursoRepository.update(req.params.id, req.body);
    if (!curso) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }
    res.status(200).json(curso);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCurso = async (req, res) => {
  try {
    const success = await cursoRepository.remove(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCursos, getCursoById, createCurso, updateCurso, deleteCurso };
