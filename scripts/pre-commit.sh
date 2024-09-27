#!/bin/bash

# Activate the virtual environment
source venv/bin/activate

# Run ruff
make lint

# If ruff finds issues, exit with a non-zero status
if [ $? -ne 0 ]; then
    echo "Ruff found issues. Please fix them before committing."
    exit 1
fi