#!/bin/bash

# Build Docker image
docker build -t walter-img .

# Run Docker container
docker run -it walter-img