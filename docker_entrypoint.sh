#!/bin/bash

set -e

echo "Starting Hello World service..."

# Function to handle shutdown gracefully
cleanup() {
    echo "Shutting down..."
    if [ ! -z "$NGINX_PID" ]; then
        echo "Stopping nginx..."
        kill -TERM "$NGINX_PID" 2>/dev/null || true
        wait "$NGINX_PID" 2>/dev/null || true
    fi
    if [ ! -z "$MONGOD_PID" ]; then
        echo "Stopping MongoDB..."
        kill -TERM "$MONGOD_PID" 2>/dev/null || true
        wait "$MONGOD_PID" 2>/dev/null || true
    fi
    if [ ! -z "$NODE_PID" ]; then
        echo "Stopping Node.js server..."
        kill -TERM "$NODE_PID" 2>/dev/null || true
        wait "$NODE_PID" 2>/dev/null || true
    fi
    echo "Cleanup complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Ensure data directory exists
mkdir -p /data/db

# Start MongoDB
echo "Starting MongoDB..."
mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017 --quiet &
MONGOD_PID=$!
echo "MongoDB started with PID: $MONGOD_PID"

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
for i in {1..30}; do
    if echo 'db.runCommand("ping")' | mongo --quiet localhost:27017/test >/dev/null 2>&1; then
        echo "MongoDB is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "MongoDB failed to start within 30 seconds"
        exit 1
    fi
    echo "Waiting for MongoDB... ($i/30)"
    sleep 1
done

# Initialize MongoDB with sample data
echo "Initializing database..."
mongo helloworld --eval "
if (db.users.countDocuments({}) === 0) {
    print('Adding sample data...');
    db.users.insertMany([
        {name: 'Alice', email: 'alice@example.com', createdAt: new Date()},
        {name: 'Bob', email: 'bob@example.com', createdAt: new Date()}
    ]);
    print('Sample data added');
}
" || echo "Database initialization completed"

# Start nginx
echo "Starting nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!
echo "nginx started with PID: $NGINX_PID"

# Start Node.js server
echo "Starting Node.js server on port 3001..."
cd /app && node server.js &
NODE_PID=$!
echo "Node.js server started with PID: $NODE_PID"

echo "Hello World service is running!"
echo "Frontend available on port 80, API on port 3001"

# Keep script running and monitor processes
while true; do
    if ! kill -0 "$NGINX_PID" 2>/dev/null || ! kill -0 "$MONGOD_PID" 2>/dev/null || ! kill -0 "$NODE_PID" 2>/dev/null; then
        echo "One of the processes died, shutting down..."
        cleanup
    fi
    sleep 5
done
