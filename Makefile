# Makefile for ChordPro project

# Variables
VENV_NAME := venv
PYTHON := python3
PIP := $(VENV_NAME)/bin/pip
PYTEST := $(VENV_NAME)/bin/pytest
DOCKER := docker

# Phony targets
.PHONY: all venv dev-venv test clean lint lint-fix format format-check

# Default target
all: venv

# Create virtual environment
venv: install-hooks
	$(PYTHON) -m venv $(VENV_NAME)
	$(PIP) install -r requirements.txt

# Create development virtual environment
dev-venv: install-hooks venv
	$(PIP) install -r requirements-dev.txt

# Run tests (build Docker image and run pytest)
test:
	$(DOCKER) build -t sheets-base .
	$(DOCKER) build -t sheets-test -f Dockerfile.test .
	$(DOCKER) run --rm sheets-test

# Clean up
clean:
	rm -rf $(VENV_NAME)
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -delete

lint:
	$(VENV_NAME)/bin/ruff check .

lint-fix:
	$(VENV_NAME)/bin/ruff check --fix .

format:
	$(VENV_NAME)/bin/ruff format .

format-check:
	$(VENV_NAME)/bin/ruff format --check .

run:
	$(DOCKER) run -p 8081:8081 sheets-base

# Install pre-commit hook
install-hooks:
	@echo "Installing pre-commit hook..."
	@mkdir -p .git/hooks
	@cp scripts/pre-commit.sh .git/hooks/pre-commit
	@chmod +x .git/hooks/pre-commit
