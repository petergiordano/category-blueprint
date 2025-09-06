#!/bin/bash

# Script to copy validation scripts to new projects
# This is used by the initialization script when Gyro features are enabled

set -e

TEMPLATE_DIR="/Users/petergiordano/Documents/GitHub/vsmonster/ai-dev-cycle-template"
TARGET_DIR="$1"

if [[ -z "$TARGET_DIR" ]]; then
    echo "Usage: $0 <target_directory>"
    exit 1
fi

echo "Copying validation scripts to $TARGET_DIR..."

# Create validation directory
mkdir -p "$TARGET_DIR/scripts/validation"

# Copy validation scripts
cp "$TEMPLATE_DIR/scripts/validation/validate-specifications.py" "$TARGET_DIR/scripts/validation/"
cp "$TEMPLATE_DIR/scripts/validation/validate-steering.py" "$TARGET_DIR/scripts/validation/"
cp "$TEMPLATE_DIR/scripts/validation/validate-hooks.py" "$TARGET_DIR/scripts/validation/"
cp "$TEMPLATE_DIR/scripts/validation/validate-production-ready.py" "$TARGET_DIR/scripts/validation/"
cp "$TEMPLATE_DIR/scripts/validation/run-all-validations.py" "$TARGET_DIR/scripts/validation/"

# Copy validation config
cp "$TEMPLATE_DIR/.claude/validation-config.json" "$TARGET_DIR/.claude/"

# Copy enhanced test framework
cp "$TEMPLATE_DIR/scripts/test-framework.py" "$TARGET_DIR/scripts/"

# Copy test configuration template
mkdir -p "$TARGET_DIR/config"
cp "$TEMPLATE_DIR/config/test-config-template.json" "$TARGET_DIR/config/test-config.json"

# Make scripts executable
chmod +x "$TARGET_DIR/scripts/validation/"*.py
chmod +x "$TARGET_DIR/scripts/test-framework.py"

echo "Validation scripts and enhanced testing framework copied successfully!"