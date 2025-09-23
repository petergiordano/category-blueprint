#!/bin/bash

# Archive duplicate files with "space + number" pattern
# This script moves files matching " [0-9].*" to archive/duplicates-2025-09-23/

ARCHIVE_DIR="archive/duplicates-2025-09-23"

# Counter for files moved
count=0

# Find all files with space+number pattern (excluding node_modules and .git)
find . -type f -name "* [0-9].*" 2>/dev/null | grep -v node_modules | grep -v .git | while read -r file; do
    # Remove leading ./
    relative_path="${file#./}"

    # Get directory path
    dir_path=$(dirname "$relative_path")

    # Skip if already in archive
    if [[ "$relative_path" == archive/* ]]; then
        echo "Skipping already archived: $relative_path"
        continue
    fi

    # Create target directory structure in archive
    if [ "$dir_path" != "." ]; then
        mkdir -p "$ARCHIVE_DIR/$dir_path"
    fi

    # Move the file
    mv "$file" "$ARCHIVE_DIR/$relative_path"
    echo "Archived: $relative_path"
    ((count++))
done

echo "Total files archived: $(find $ARCHIVE_DIR -type f | wc -l)"