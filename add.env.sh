#!/bin/bash

# Specify the content to be written to the .env.local file
ENV_CONTENT="VITE_LOCAL_STORAGE_PREFIX=dmim\nVITE_API_URL=http://10.10.82.249:3000\nVITE_APP_FORCE_LOGIN=true"


# Check if .env.local file exists
if [ -f .env.local ]; then
    # If the file exists, override its contents
    echo -e "$ENV_CONTENT" > .env.local
    echo "Existing .env.local file updated."
else
    # If the file doesn't exist, create it and write the content
    echo -e "$ENV_CONTENT" > .env.local
    echo ".env.local file created."
fi