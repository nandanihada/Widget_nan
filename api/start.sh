#!/bin/bash

# Start script for Render deployment
echo "Starting the Flask application with Gunicorn..."
gunicorn --config gunicorn.conf.py app:app
