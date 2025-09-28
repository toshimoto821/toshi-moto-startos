# Build frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node:18-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./

# Final image - use Ubuntu with direct MongoDB binary download
FROM ubuntu:20.04

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    nginx \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*


# image: mongo:4.4.6-bionic@sha256:3d0e6df9fd5bc42cbf8ef8bc9e6c4e78f6f26c7157dbd7bdec72d202ab8ebe3a

# Download and install MongoDB binaries directly for better architecture compatibility
RUN ARCH=$(dpkg --print-architecture) \
    && echo "Building for architecture: $ARCH" \
    && if [ "$ARCH" = "arm64" ]; then \
        wget https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-ubuntu2004-4.4.6.tgz -O mongodb.tgz; \
    elif [ "$ARCH" = "amd64" ]; then \
        wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.6.tgz -O mongodb.tgz; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1; \
    fi \
    && tar -xzf mongodb.tgz \
    && cp mongodb-*/bin/* /usr/local/bin/ \
    && file /usr/local/bin/mongod \
    && rm -rf mongodb* \
    && mkdir -p /data/db

# Copy backend
WORKDIR /app
COPY --from=backend /app ./

# Copy frontend build
COPY --from=frontend /app/build /var/www/html/

# Copy configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker_entrypoint.sh /usr/local/bin/
COPY check-web.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker_entrypoint.sh /usr/local/bin/check-web.sh

# Create MongoDB user and data directory
RUN useradd -r -M -d /data -s /bin/false mongodb \
    && mkdir -p /data/db \
    && chown -R mongodb:mongodb /data

EXPOSE 80 3001

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]