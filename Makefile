# Makefile for Dashboard Fabril

.PHONY: help build up down logs clean lint shell

help:
	@echo "Comandos disponíveis:"
	@echo "  make build   - Build da imagem Docker"
	@echo "  make up      - Sobe os containers (docker-compose up -d)"
	@echo "  make down    - Para os containers (docker-compose down)"
	@echo "  make logs    - Mostra os logs do container principal"
	@echo "  make clean   - Remove containers, volumes e cache"
	@echo "  make lint    - Verifica lint do Python (flake8)"
	@echo "  make shell   - Abre um shell no container principal"

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