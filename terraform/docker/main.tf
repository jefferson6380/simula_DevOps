terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

provider "docker" {}

# Construção da imagem da API NodeJS a partir do Dockerfile na raiz do projeto
resource "docker_image" "node_api_image" {
  name = "node-api-image"

  build {
    context    = "${path.root}/../.."
    dockerfile = "${path.root}/../../Dockerfile"
  }

}

# Rede Docker para comunicação entre containers
resource "docker_network" "rede_docker" {
  name   = "rede-docker"
  driver = "bridge"
}

# Volume para persistência dos dados do PostgreSQL
resource "docker_volume" "meu_volume_docker" {
  name = "volume-docker"
}

# Container do PostgreSQL
resource "docker_container" "postgres_container" {
  name  = "postgres-db"
  image = "postgres:13"

  networks_advanced {
    name = docker_network.rede_docker.name
  }

  volumes {
    volume_name    = docker_volume.meu_volume_docker.name
    container_path = "/var/lib/postgresql/data"
  }

  env = [
    "POSTGRES_USER=meuusuario",
    "POSTGRES_PASSWORD=minhasenha",
    "POSTGRES_DB=meubanco"
  ]

  ports {
    internal = 5432
    external = 5432
  }
}

# Container da API NodeJS
resource "docker_container" "node_api_container" {
  name  = "node-api"
  image = docker_image.node_api_image.name

  networks_advanced {
    name = docker_network.rede_docker.name
  }

  env = [
    "DB_HOST=postgres-db",
    "DB_USER=meuusuario",
    "DB_PASSWORD=minhasenha",
    "DB_NAME=meubanco"
  ]

  ports {
    internal = 3000
    external = 3000
  }

  depends_on = [
    docker_container.postgres_container
  ]
}

