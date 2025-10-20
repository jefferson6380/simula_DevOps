-- DDL para criação das tabelas de alunos e cursos

-- Tabela de Cursos
CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alunos
CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    curso_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_curso
        FOREIGN KEY(curso_id) 
        REFERENCES cursos(id)
        ON DELETE SET NULL
);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO cursos (nome, descricao) VALUES ('Ciência da Computação', 'Curso focado em algoritmos, estruturas de dados e desenvolvimento de software.');
INSERT INTO cursos (nome, descricao) VALUES ('Engenharia de DevOps', 'Curso avançado sobre práticas de DevOps, CI/CD, e infraestrutura como código.');
