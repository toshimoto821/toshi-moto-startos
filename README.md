# Hello World Full Stack - Start9 Service

A complete full-stack web application demonstrating how to package React, Node.js, and MongoDB for StartOS.

## Overview

This service demonstrates:

- **Frontend**: React application with modern UI
- **Backend**: Node.js/Express REST API
- **Database**: MongoDB for data persistence
- **Packaging**: Complete Start9 service wrapper

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  React Frontend │    │ Node.js Backend │    │     MongoDB     │
│  (nginx:80)     │    │   (Port 3001)   │    │  (Port 27017)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       ▲                       ▲
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                     ┌─────────────────┐
                     │ nginx Reverse   │
                     │ Proxy (/api/*)  │
                     └─────────────────┘
```

## Project Structure

```
hello-world/
├── manifest.yaml              # Start9 service configuration
├── Dockerfile                 # Multi-stage container build
├── docker_entrypoint.sh       # Service startup script
├── check-web.sh              # Health check script
├── nginx.conf                # nginx configuration
├── Makefile                  # Build automation
├── instructions.md           # User instructions
├── LICENSE                   # MIT license
├── icon.png                  # Service icon
├── frontend/                 # React application
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js
│       └── App.css
└── backend/                  # Node.js API server
    ├── package.json
    └── server.js
```

## Features

### User Interface

- Modern, responsive React frontend
- Real-time user management
- Beautiful gradient design
- Mobile-friendly layout

### API Endpoints

- `GET /api/health` - Service health check
- `GET /api/hello` - Welcome message
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Database

- MongoDB for persistent storage
- User schema with name, email, timestamps
- Automatic sample data creation
- Connection retry logic

## Development

### Prerequisites

- Docker with buildx support
- Start9 SDK installed
- yq (YAML processor)

### Building the Service

1. Clone or create this repository
2. Ensure all dependencies are installed
3. Build the service package:

```bash
make
```

This will:

- Build Docker images for both AMD64 and ARM64
- Create the `.s9pk` package file
- Verify the package integrity

### Installing on StartOS

1. **Via Web Interface:**

   - Navigate to System → Sideload Service
   - Upload the generated `hello-world-fullstack.s9pk` file

2. **Via CLI:**
   ```bash
   start-cli package install hello-world-fullstack.s9pk
   ```

### Local Development

For local development of the frontend and backend:

1. **Backend Development:**

   ```bash
   cd backend
   npm install
   # Start MongoDB locally first
   npm start
   ```

2. **Frontend Development:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

The frontend development server will proxy API requests to the backend.

## Docker Container Details

The Dockerfile creates a single container that runs:

1. MongoDB database server
2. Node.js backend API server
3. Static React frontend files

### Container Structure

- **Base Image**: `node:18-alpine`
- **Additional Packages**: MongoDB, nginx, bash, curl, jq
- **User**: Non-root user `appuser`
- **Data Volume**: `/root/data` (persisted across restarts)
- **Exposed Ports**: 80 (nginx frontend), 3001 (backend API)

### Startup Process

1. Start MongoDB with data persistence
2. Wait for MongoDB to be ready
3. Initialize database with sample data (first run only)
4. Start nginx to serve frontend and proxy API requests
5. Start Node.js server for API endpoints
6. Monitor all processes for health

## Configuration

The service is configured via `manifest.yaml`:

- **Interfaces**: Web UI accessible via Tor and LAN
- **Volumes**: Persistent data storage
- **Health Checks**: Automated service monitoring
- **Backup**: Full data backup and restore support

## Customization

This service serves as a template for building full-stack applications on StartOS. To customize:

1. **Frontend**: Modify React components in `frontend/src/`
2. **Backend**: Update API routes and logic in `backend/server.js`
3. **Database**: Adjust schemas and queries as needed
4. **Packaging**: Update `manifest.yaml` for your service requirements

## Troubleshooting

### Common Issues

1. **Build Failures**: Ensure Docker buildx is properly configured
2. **Health Check Failures**: Check MongoDB connection and API availability
3. **Data Loss**: Verify volume mounts in `manifest.yaml`

### Debugging

- Check service logs in StartOS dashboard
- Use health check endpoint: `/api/health`
- Monitor individual processes in container

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:

- GitHub Issues: [Create an issue](https://github.com/Start9Labs/hello-world-fullstack/issues)
- Start9 Community: Join the community forums
- Documentation: [Start9 Developer Docs](https://docs.start9.com)
