const alunoRepository = require('../repositories/alunoRepository');

const getAllAlunos = async (req, res) => {
  try {
    const alunos = await alunoRepository.findAll();
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlunoById = async (req, res) => {
  try {
    const aluno = await alunoRepository.findById(req.params.id);
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.status(200).json(aluno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAluno = async (req, res) => {
  try {
    const aluno = await alunoRepository.create(req.body);
    res.status(201).json(aluno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAluno = async (req, res) => {
  try {
    const aluno = await alunoRepository.update(req.params.id, req.body);
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.status(200).json(aluno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAluno = async (req, res) => {
  try {
    const success = await alunoRepository.remove(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllAlunos, getAlunoById, createAluno, updateAluno, deleteAluno };
