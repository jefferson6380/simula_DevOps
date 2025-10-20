const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/database/db');

// Mock do banco de dados para evitar chamadas reais durante os testes
jest.mock('../../src/database/db');

describe('Testes de Integração da API', () => {
  let cursoId;
  let alunoId;

  // Mock das implementações
  const mockCurso = { id: 1, nome: 'Curso Teste', descricao: 'Desc Teste' };
  const mockAluno = { id: 1, nome: 'Aluno Teste', email: 'aluno@teste.com', curso_id: 1 };

  beforeEach(() => {
    // Resetar mocks antes de cada teste
    db.query.mockReset();
  });

  describe('Endpoints de Cursos', () => {
    it('POST /cursos - Deve criar um novo curso', async () => {
      db.query.mockResolvedValue({ rows: [mockCurso], rowCount: 1 });
      
      const response = await request(app)
        .post('/cursos')
        .send({ nome: 'Curso Teste', descricao: 'Desc Teste' });
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('Curso Teste');
      cursoId = response.body.id;
    });

    it('GET /cursos/:id - Deve retornar um curso', async () => {
      db.query.mockResolvedValue({ rows: [mockCurso], rowCount: 1 });
      
      const response = await request(app).get(`/cursos/${cursoId}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(cursoId);
    });
  });

  describe('Endpoints de Alunos', () => {
    it('POST /alunos - Deve criar um novo aluno', async () => {
      const newAluno = { nome: 'Aluno Teste', email: 'aluno@teste.com', curso_id: cursoId };
      db.query.mockResolvedValue({ rows: [{...newAluno, id: 1}], rowCount: 1 });

      const response = await request(app)
        .post('/alunos')
        .send(newAluno);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('aluno@teste.com');
      alunoId = response.body.id;
    });

    it('GET /alunos/:id - Deve retornar um aluno', async () => {
      db.query.mockResolvedValue({ rows: [{...mockAluno, id: alunoId}], rowCount: 1 });

      const response = await request(app).get(`/alunos/${alunoId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(alunoId);
    });

    it('PUT /alunos/:id - Deve atualizar um aluno', async () => {
      const updatedAluno = { nome: 'Aluno Teste Atualizado', email: 'aluno@teste.com', curso_id: cursoId };
      db.query.mockResolvedValue({ rows: [{...updatedAluno, id: alunoId}], rowCount: 1 });

      const response = await request(app)
        .put(`/alunos/${alunoId}`)
        .send(updatedAluno);

      expect(response.statusCode).toBe(200);
      expect(response.body.nome).toBe('Aluno Teste Atualizado');
    });

    it('DELETE /alunos/:id - Deve deletar um aluno', async () => {
      db.query.mockResolvedValue({ rowCount: 1 });
      
      const response = await request(app).delete(`/alunos/${alunoId}`);
      
      expect(response.statusCode).toBe(204);
    });

    it('GET /alunos/:id - Deve retornar 404 para aluno deletado', async () => {
      db.query.mockResolvedValue({ rows: [], rowCount: 0 });

      const response = await request(app).get(`/alunos/${alunoId}`);
      
      expect(response.statusCode).toBe(404);
    });
  });
});
