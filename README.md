# Dynamic Widget System

A backend API system for creating and managing dynamic widgets with user authentication and project management.

## Features

- User authentication (register, login, profile)
- Project management (create, update, delete projects)
- Widget response collection
- JWT-based authentication
- MongoDB database integration
- TypeScript support
- Input validation with Joi
- Security middleware (Helmet, CORS, Rate limiting)

## Prerequisites

- Node.js (>= 18.0.0)
- MongoDB (local or cloud instance)
- npm or yarn

## Getting Started

### 1. Environment Setup

Copy the environment variables and update as needed:

```bash
cd api
cp .env.example .env
```

Update the `.env` file with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT tokens

### 2. Install Dependencies

```bash
cd api
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 4. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)

### Projects
- `GET /api/projects/:projectId` - Get project details
- `POST /api/projects` - Create new project (authenticated)
- `PUT /api/projects/:projectId` - Update project (authenticated)

### Users
- `GET /api/users/projects` - Get user's projects (authenticated)
- `DELETE /api/users/projects/:projectId` - Delete project (authenticated)
- `GET /api/users/projects/:projectId/responses` - Get project responses (authenticated)

### Widget
- `POST /api/widget/:projectId/submit` - Submit widget response

## Project Structure

```
api/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Route definitions
│   ├── types/          # TypeScript type definitions
│   └── server.ts       # Main server file
├── package.json
├── tsconfig.json
├── .env               # Environment variables
└── .gitignore
```

## Technologies Used

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, express-rate-limit
- **Development**: Nodemon, ts-node

## Development

The backend is configured with:
- Hot reload with nodemon
- TypeScript compilation
- Environment-based configuration
- MongoDB connection with automatic retry
- Comprehensive error handling
- Request validation
- Security headers

## License

This project is for development purposes.
