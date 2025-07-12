# Makefile for Dashboard Fabril

.PHONY: help build up down logs clean lint shell

help:
	@echo "Comandos disponíveis:"
	@echo "  make build         - Build da imagem Docker"
	@echo "  make up            - Sobe os containers (docker-compose up -d)"
	@echo "  make down          - Para os containers (docker-compose down)"
	@echo "  make logs          - Mostra os logs do container principal"
	@echo "  make clean         - Remove containers, volumes e cache"
	@echo "  make lint          - Verifica lint do Python (flake8)"
	@echo "  make shell         - Abre um shell no container principal"
	@echo "  make build-prod    - Build da imagem Docker para produção"
	@echo "  make up-prod       - Sobe os containers de produção"
	@echo "  make down-prod     - Para os containers de produção"
	@echo "  make logs-prod     - Mostra os logs do container de produção"
	@echo "  make shell-prod    - Abre um shell no container de produção"
	@echo "  make version       - Mostra a versão atual do sistema"
	@echo "  make version-info  - Mostra informações detalhadas da versão"
	@echo "  make version-update VERSION=X.Y.Z - Atualiza a versão do sistema"
	@echo "  make changelog     - Mostra o changelog estruturado"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f dashboard

clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

lint:
	pip install flake8 || true
	flake8 app.py

shell:
	docker-compose exec dashboard /bin/sh 

build-prod:
	docker-compose -f docker-compose.prod.yml build

up-prod:
	docker-compose -f docker-compose.prod.yml up -d

down-prod:
	docker-compose -f docker-compose.prod.yml down

logs-prod:
	docker-compose -f docker-compose.prod.yml logs -f dashboard

shell-prod:
	docker-compose -f docker-compose.prod.yml exec dashboard /bin/sh

# Version management
version:
	@python utils/version.py

version-info:
	@python utils/version.py info

version-update:
	@echo "Usage: make version-update VERSION=X.Y.Z"
	@if [ -z "$(VERSION)" ]; then echo "Error: VERSION parameter required"; exit 1; fi
	@python utils/version.py update $(VERSION)
	@echo "Version updated to $(VERSION)"
	@echo "Don't forget to update CHANGELOG.md!"

changelog:
	@python utils/version.py changelog 