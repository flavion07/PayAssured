#!/usr/bin/env python
import os
import sys
from pathlib import Path

# Print current directory and .env file location
print(f"Current directory: {os.getcwd()}")
print(f"Script location: {Path(__file__).parent}")

# Check if .env exists
env_path = Path(".env")
print(f".env exists: {env_path.exists()}")
if env_path.exists():
    print(f".env content:")
    with open(env_path) as f:
        print(f.read())

# Add to path and import
sys.path.insert(0, str(Path(__file__).parent))
from settings import settings

print(f"\nDatabase URL: {settings.database_url}")
print(f"Debug: {settings.debug}")
