.PHONY: help install build run lint test ats-score clean fclean

help:
	@printf "OpenResume Makefile targets:\n"
	@printf "  make install   Install dependencies\n"
	@printf "  make build     Build production bundle\n"
	@printf "  make run       Start dev server\n"
	@printf "  make lint      Run eslint\n"
	@printf "  make test      Run tests (watch)\n"
	@printf "  make ats-score Run ATS score CLI (pass ARGS=...)\n"
	@printf "  make fclean    Remove node_modules and build artifacts\n"
	@printf "\nExamples:\n"
	@printf "  make run\n"
	@printf "  make ats-score ARGS=\"--file resume.pdf --json\"\n"

install:
	npm install
	npx update-browserslist-db@latest

build: install
	npm run build

run:
	npm run dev

lint:
	npm run lint

test:
	npm run test

ats-score:
	npm run ats-score -- $(ARGS)

clean:
	rm -rf .next dist

fclean: clean
	rm -rf node_modules package-lock.json
