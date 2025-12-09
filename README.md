# ITS - Intelligent Tutoring System

A service-based educational platform implementing SOLID principles for personalized, adaptive learning experiences.

## Overview

ITS (Intelligent Tutoring System) is an AI-powered educational platform that provides:

- **Personalized Learning** - Assess student strengths/weaknesses and deliver customized content
- **Assessment & Evaluation** - Quizzes, exams, and projects with automated/manual grading
- **Content Management** - Manage learning materials (videos, documents, interactive content)
- **Instructor Dashboard** - Monitor student progress, manage courses, generate reports
- **Adaptive Feedback** - Performance feedback with guidance and hints

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.5.8
- Spring Cloud Gateway
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Gradle

### Frontend
- React 19
- TypeScript 5.9
- Vite 7
- Tailwind CSS 4
- React Query 5
- React Router 7

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend (React)                          │
│                         http://localhost:5173                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API Gateway (Spring Cloud)                       │
│                         http://localhost:8083                       │
└───────┬─────────────────────┬───────────────────────┬───────────────┘
        │                     │                       │
        ▼                     ▼                       ▼
┌───────────────┐   ┌─────────────────┐   ┌────────────────────┐
│  Auth Service │   │ Content Service │   │ Assessment Service │
│   Port: 8084  │   │   Port: 8082    │   │    Port: 8081      │
└───────┬───────┘   └────────┬────────┘   └──────────┬─────────┘
        │                    │                       │
        └────────────────────┼───────────────────────┘
                             ▼
                ┌─────────────────────────┐
                │   PostgreSQL Database   │
                │       Port: 5433        │
                └─────────────────────────┘
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **api-gateway** | 8083 | Routes requests to backend services |
| **auth_service** | 8084 | User authentication (JWT-based) |
| **content-management-service** | 8082 | Courses and learning content CRUD |
| **assessment-service** | 8081 | Assessments, questions, submissions |

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hieuvovan0103/its-system.git
   cd its-system
   ```

2. **Start the database**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Run backend services** (in separate terminals)
   ```bash
   # Auth Service
   cd backend/auth_service
   ./gradlew bootRun

   # Content Service
   cd backend/content-management-service
   ./gradlew bootRun

   # Assessment Service
   cd backend/assessment-service
   ./gradlew bootRun

   # API Gateway
   cd backend/api-gateway
   ./gradlew bootRun
   ```

4. **Run the frontend**
   ```bash
   cd frontend/its-frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:8083

## Project Structure

```
its-system/
├── backend/
│   ├── api-gateway/                  # Spring Cloud Gateway
│   ├── auth_service/                 # Authentication service
│   ├── assessment-service/           # Assessment management
│   ├── content-management-service/   # Content & course management
│   └── docker-compose.yml            # PostgreSQL container
│
├── frontend/
│   └── its-frontend/
│       ├── src/
│       │   ├── components/           # Reusable UI components
│       │   ├── contexts/             # React contexts
│       │   ├── pages/                # Route pages
│       │   ├── services/             # API clients
│       │   └── types/                # TypeScript definitions
│       └── package.json
│
└── README.md
```

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and get JWT token |

### Content Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/contents` | List all content |
| POST | `/api/v1/contents` | Create new content |
| GET | `/api/v1/contents/{id}` | Get content by ID |
| PUT | `/api/v1/contents/{id}` | Update content |
| DELETE | `/api/v1/contents/{id}` | Delete content |
| GET | `/api/v1/courses` | List all courses |
| POST | `/api/v1/courses` | Create new course |

### User Roles

- **STUDENT** - Can view content and take assessments
- **INSTRUCTOR** - Can create/manage content and assessments
- **ADMIN** - Full system access

## Design Principles

This project demonstrates SOLID principles:

| Principle | Implementation |
|-----------|----------------|
| **Single Responsibility** | Each microservice handles one domain |
| **Open/Closed** | Interface + Implementation pattern |
| **Liskov Substitution** | User inheritance (Student/Instructor) |
| **Interface Segregation** | Granular service interfaces |
| **Dependency Inversion** | Services depend on abstractions |

## Development

### Running Tests
```bash
cd backend/[service-name]
./gradlew test
```

### Building for Production
```bash
# Backend
cd backend/[service-name]
./gradlew build

# Frontend
cd frontend/its-frontend
npm run build
```

### Linting
```bash
cd frontend/its-frontend
npm run lint
```

## Team Members

| Avatar | Name | GitHub |
|--------|------|--------|
| <img src="https://github.com/Yudov03.png" width="50" height="50" style="border-radius: 50%"> | **Yudov03** | [@Yudov03](https://github.com/Yudov03) |
| <img src="https://github.com/hieuvovan0103.png" width="50" height="50" style="border-radius: 50%"> | **hieuvovan0103** | [@hieuvovan0103](https://github.com/hieuvovan0103) |
| <img src="https://github.com/vyvy31082004.png" width="50" height="50" style="border-radius: 50%"> | **vyvy31082004** | [@vyvy31082004](https://github.com/vyvy31082004) |
| <img src="https://github.com/salamander53.png" width="50" height="50" style="border-radius: 50%"> | **salamander53** | [@salamander53](https://github.com/salamander53) |

## License

This project is developed as part of a Software Architecture course assignment.

---

<p align="center">
  <i>Built with modern technologies and best practices</i>
</p>
