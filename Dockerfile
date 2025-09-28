# Build toshi
FROM node:20-alpine AS toshi
WORKDIR /app

RUN npm install -g pnpm

COPY toshi-moto ./toshi-moto
RUN npm run toshi:install
# frontend is toshi-moto/apps/web-ui
RUN npm run toshi:build-ui
RUN npm run toshi:build-api


# Final image - use Ubuntu with direct MongoDB binary download
FROM ubuntu:20.04

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    nginx \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# version of mongo after 4.4.6 dont work on raspberry pi
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
COPY --from=toshi /app/toshi-moto/dist/apps/api/ ./

# Copy frontend build
COPY --from=toshi /app/toshi-moto/apps/web-ui/dist /var/www/html/

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