.PHONY: help install build run lint test typecheck audit audit-prod verify clean fclean docker-build docker-up docker-down docker-logs update docker-prod-local docker-prod-local-logs

help:
        @printf "CVForge Makefile targets:\n"
        @printf "  make install   Install dependencies\n"
        @printf "  make build     Build production bundle\n"
        @printf "  make run       Start dev server\n"
        @printf "  make lint      Run eslint\n"
        @printf "  make test      Run tests (watch)\n"
        @printf "  make typecheck Run typescript type-check\n"
        @printf "  make audit     Run npm audit\n"
        @printf "  make audit-prod Run npm audit (production only)\n"
        @printf "  make verify    Run full quality gate (lint, typecheck, test, build, audit)\n"
        @printf "  make ats-score Run ATS score CLI (pass ARGS=...)\n"
        @printf "  make fclean    Remove node_modules and build artifacts\n"
        @printf "  make update    Update and redeploy (host)\n"
        @printf "  make docker-prod-local Run production container locally\n"
        @printf "  make docker-prod-local-logs Tail local production container logs\n"
        @printf "\nExamples:\n"
        @printf "  make run\n"
        @printf "  make ats-score ARGS=\"--file resume.pdf --json\"\n"

install:
        npm ci || npm install
        npx update-browserslist-db@latest

build: install
        npm run build

run:
        npm run dev

lint:
        npm run lint

test:
        npm run test

typecheck:
        npm run typecheck

audit:
        npm run audit

audit-prod:
        npm run audit:prod

verify:
        npm run verify

ats-score:
        npm run ats-score -- $(ARGS)

docker-build:
	docker compose build

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f cvforge

docker-prod-local:
	./scripts/run-prod-local.sh

docker-prod-local-logs:
	docker compose -f docker-compose.local.yml logs -f cvforge

update:
	./scripts/update-host.sh

clean:
	rm -rf .next dist

fclean: clean
	rm -rf node_modules package-lock.json
