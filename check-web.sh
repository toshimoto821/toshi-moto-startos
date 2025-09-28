#!/bin/bash

# Health check script for Hello World Full Stack service with nginx

set -e

echo "Checking service health..."

# Check if nginx is responding (frontend)
if ! curl -f -s http://localhost:80/nginx-health > /dev/null 2>&1; then
    echo '{"status": "error", "message": "nginx frontend server is not responding"}'
    exit 1
fi

# Check if the backend API is responding
if ! curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo '{"status": "error", "message": "Backend API server is not responding"}'
    exit 1
fi

# Check if MongoDB is accessible via the API (through nginx proxy)
if ! curl -f -s http://localhost:80/api/users > /dev/null 2>&1; then
    echo '{"status": "error", "message": "Database connection failed or API proxy not working"}'
    exit 1
fi

# All checks passed
echo '{"status": "success", "message": "Frontend (nginx), backend API, and database are all healthy"}'
exit 0
