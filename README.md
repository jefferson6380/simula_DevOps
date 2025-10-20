# Exercício de DevOps: CI/CD e IaC para uma API NodeJS

Hoje vocÊ deve atuar como um especialista em DevOps! 

Neste exercício, seu papel é atuar como um Engenheiro de DevOps/SRE (Site Reliability Engineer). Você recebeu um repositório de uma equipe de desenvolvimento contendo uma nova aplicação. Sua missão é criar todo o ambiente, automação e infraestrutura para que essa aplicação seja entregue e executada com eficiência e confiabilidade, simulando um cenário real do dia a dia.

Este exercício foi projetado para aplicar de forma prática os conceitos que aprendemos em sala de aula.

## 1. Objetivo

O objetivo é pegar uma aplicação NodeJS funcional, porém "crua", e construir todo o pipeline de automação e a infraestrutura necessária para publicá-la na nuvem, seguindo as melhores práticas de DevOps.

## 2. Descrição do Projeto

Este repositório contém uma simples API RESTful para gerenciar alunos e cursos.

- **Tecnologias:** NodeJS, Express, PostgreSQL.
- **Funcionalidades:** CRUD (Create, Read, Update, Delete) completo para os endpoints `/alunos` e `/cursos`.
- **Testes:** O projeto já inclui testes de integração para validar o comportamento da API.
- **Banco de Dados:** O script de criação do banco (`schema.sql`) está em `src/database/`.

## 3. Sua Missão

Sua tarefa é dividida em duas partes principais: **CI/CD (Continuous Integration/Continuous Deployment)** e **IaC (Infrastructure as Code)**.

### Parte 1: Configurar o Pipeline de CI/CD com GitHub Actions

Você deve criar o workflow do GitHub Actions para automatizar a verificação do código.

1.  Na raiz do projeto, crie o diretório `.github/workflows/`.
2.  Dentro dele, crie um arquivo chamado `ci.yml` (ou o nome que preferir).
3.  **Configure o workflow para que ele:**
    - Seja acionado a cada `push` na branch `main` ou em `pull requests` para a `main`.
    - Execute em um ambiente Ubuntu (`ubuntu-latest`).
    - **Passo 1: Checkout:** Use a action `actions/checkout@v3` para baixar o código.
    - **Passo 2: Setup Node.js:** Use a action `actions/setup-node@v3` para configurar o ambiente NodeJS (use a versão 18, por exemplo).
    - **Passo 3: Instalar Dependências:** Execute `npm install` para instalar os pacotes do projeto. É uma boa prática usar cache para o diretório `node_modules` para acelerar builds futuros.
    - **Passo 4: Rodar Verificação de Estilo (Lint):** Execute o comando `npm run lint` para garantir que o código segue as boas práticas.
    - **Passo 5: Rodar Testes:** Execute `npm test` para rodar os testes de integração e garantir que a aplicação está funcionando como esperado. O pipeline só deve passar se todos os testes forem bem-sucedidos.

### Parte 2: Provisionar a Infraestrutura com Terraform

Você tem a liberdade de escolher onde sua aplicação será executada: localmente com Docker ou na nuvem com AWS.

#### Opção A: Infraestrutura com Docker (Local)

Crie os arquivos Terraform dentro do diretório `terraform/docker/` para subir a aplicação e o banco de dados em containers Docker.

- **`main.tf`:**
    - Configure o provider do Docker.
    - Crie uma `docker_network` para que os containers possam se comunicar.
    - Crie um `docker_volume` para a persistência dos dados do PostgreSQL.
    - Crie o container do **PostgreSQL** (`docker_container`):
        - Use a imagem `postgres:13`.
        - Conecte-o à rede criada.
        - Monte o volume para persistir os dados em `/var/lib/postgresql/data`.
        - Defina as variáveis de ambiente necessárias (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).
    - Crie o container da **API NodeJS** (`docker_container`):
        - **Importante:** Você precisará primeiro construir uma imagem Docker para a aplicação. Crie um `Dockerfile` na raiz do projeto.
        - Use a imagem que você construiu.
        - Conecte-o à rede criada.
        - Defina as variáveis de ambiente para a conexão com o banco de dados (`DB_HOST` deve ser o nome do container do Postgres, `DB_USER`, `DB_PASSWORD`, etc.).
        - Mapeie a porta 3000 do container para uma porta em sua máquina local (ex: `3000:3000`).
        - Configure `depends_on` para garantir que o container do banco de dados suba antes da API.

#### Opção B: Infraestrutura com AWS (Nuvem)

Crie os arquivos Terraform dentro do diretório `terraform/aws/` para subir a infraestrutura na AWS.

- **`main.tf`:**
    - Configure o provider da AWS (região `us-east-1`, por exemplo).
    - Crie uma **EC2 Instance** (`aws_instance`):
        - Escolha uma AMI (Amazon Machine Image) do Ubuntu.
        - Escolha um tipo de instância (ex: `t2.micro`).
        - Associe um `aws_security_group` que libere a porta `22` (SSH) e a porta `3000` (para a API).
        - Use um `user_data` script para instalar o NodeJS, Git, clonar seu repositório, instalar as dependências (`npm install`) e iniciar a aplicação.
    - **Para o Banco de Dados, você tem duas opções:**
        1.  **Simples:** Instalar o PostgreSQL diretamente na mesma instância EC2 via `user_data`.
        2.  **Avançado (Recomendado):** Criar uma instância de banco de dados gerenciado com o **AWS RDS** (`aws_db_instance`). Isso é mais robusto e alinhado com as práticas de produção. Se escolher essa opção, lembre-se de configurar o `security_group` para permitir a comunicação entre a EC2 e o RDS.

## 4. Critérios de Avaliação

O exercício será considerado um sucesso se:
1.  O pipeline de CI no GitHub Actions estiver passando (testes e lint OK).
2.  Os arquivos Terraform (`.tf`) estiverem corretamente configurados no diretório da opção escolhida.
3.  Após executar `terraform apply`, a aplicação estiver acessível e funcional no ambiente provisionado (seja via `localhost:3000` no Docker ou pelo IP público da EC2 na AWS).

## 5. Como Iniciar o Projeto (Localmente para Desenvolvimento)

Antes de partir para o Terraform, você pode rodar o projeto em sua máquina.

1.  **Suba um banco de dados PostgreSQL:**
    ```bash
    docker run --name devops-db -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=devops_class -p 5432:5432 -d postgres:13
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Execute a aplicação:**
    ```bash
    npm start
    ```
A API estará disponível em `http://localhost:3000`.

Boa sorte!
