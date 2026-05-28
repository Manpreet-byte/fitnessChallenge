# Fitness Challenge Tracker API

A student-friendly backend project built with Node.js, Express, and MongoDB (Mongoose).

## Features

- User registration and login (JWT)
- Protected challenge routes
- Create, read, update, delete fitness challenges
- Update progress (auto marks completed if progress >= target)
- Get active challenges
- Get completed challenges

## Folder Structure

- `config/` (MongoDB connection)
- `controllers/` (business logic)
- `middleware/` (auth, logger, error handler)
- `models/` (Mongoose schemas)
- `routes/` (API routes)

## Setup

1. Install dependencies:
   - `npm install`
2. Create a `.env` file using `.env.example`
3. Run server:
   - `npm run dev`

## Environment Variables

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Health
- `GET /api/health`

### Challenges (JWT required)
- `POST /api/challenges`
- `GET /api/challenges`
- `GET /api/challenges/active`
- `GET /api/challenges/completed`
- `GET /api/challenges/:id`
- `PUT /api/challenges/:id`
- `PATCH /api/challenges/:id/progress`
- `DELETE /api/challenges/:id`

## Postman

- Import `postman/collection.json`
- Import environment `postman/environment.json` and select it
- Run requests in order: **Auth → Register (optional) → Login → Challenges → Create Challenge** (this sets `token` and `challengeId` automatically)

## AWS Deployment

- Docker-ready: `Dockerfile` is included for AWS ECS / App Runner / Elastic Beanstalk (Docker).
- Configure env vars in AWS: `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`.
- Health check path: `GET /api/health`.
