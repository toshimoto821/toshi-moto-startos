# Hello World Full Stack Instructions

Welcome to the Hello World Full Stack service! This is a demonstration application that showcases how to build and package a complete web application for StartOS.

## What's Included

This service demonstrates a full-stack web application with:

- **Frontend**: React application served by nginx with a modern, responsive UI
- **Backend**: Node.js/Express REST API server
- **Database**: MongoDB for persistent data storage
- **Proxy**: nginx reverse proxy for API requests

## Getting Started

1. **Start the Service**: Click the "Start" button on the service page
2. **Wait for Health Check**: The service will take a moment to initialize MongoDB and start all components
3. **Launch UI**: Once the health check passes, click "Launch UI" to open the web interface

## Features

### User Management

- Add new users with name and email
- View all users in a clean, modern interface
- Delete users with a single click
- Real-time updates when users are added or removed

### API Endpoints

The service exposes a REST API that you can interact with:

- `GET /api/health` - Health check endpoint
- `GET /api/hello` - Welcome message
- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get a specific user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Technical Details

### Architecture

- The React frontend is built and served as static files by nginx
- nginx reverse proxies API requests to the Node.js backend
- The Node.js backend provides REST API endpoints only
- MongoDB stores user data persistently across service restarts
- All components run in a single Docker container for simplicity

### Data Persistence

User data is stored in MongoDB and persists across service restarts and updates. The database is located in the service's data volume.

### Sample Data

When the service starts for the first time, it automatically creates sample users to demonstrate the functionality.

## Troubleshooting

If you encounter any issues:

1. **Service won't start**: Check the service logs for error messages
2. **UI not loading**: Ensure the health check is passing before accessing the UI
3. **Database errors**: The service will automatically attempt to reconnect to MongoDB if the connection is lost

## Development

This service serves as a template for building full-stack applications on StartOS. You can use it as a starting point for your own services by:

1. Modifying the React frontend in the `frontend/` directory
2. Updating the backend API in the `backend/` directory
3. Adjusting the MongoDB schema and data models as needed
4. Customizing the Dockerfile and entrypoint script for your requirements

## Support

For questions or issues with this service, please visit the [GitHub repository](https://github.com/Start9Labs/hello-world-fullstack) or join the Start9 community.

---

**Note**: This is a demonstration service. In a production environment, you would want to add proper authentication, input validation, error handling, and security measures.
