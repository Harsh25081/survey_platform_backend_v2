# Survey Platform API - Complete Endpoints Summary

## Quick Reference Guide

### Base URL
```
http://localhost:5000
```

### Authentication
All endpoints except `/api/auth/*` and `/api/share/validate/*` and `/api/responses/submit-token` require:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

---

## Survey Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/surveys` | Create survey | Yes |
| GET | `/api/surveys` | Get all surveys | Yes |
| GET | `/api/surveys/{id}` | Get survey by ID | Yes |
| PUT | `/api/surveys/{id}` | Update survey | Yes |
| DELETE | `/api/surveys/{id}` | Delete survey (soft) | Yes |

---

## Question Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/questions` | Create question | Yes |
| GET | `/api/questions/survey/{surveyId}` | Get questions by survey | Yes |
| PUT | `/api/questions/{id}` | Update question | Yes |
| DELETE | `/api/questions/{id}` | Delete question | Yes |

---

## AI Questions Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/ai-questions/survey/{surveyId}` | Get AI questions by survey | Yes |
| POST | `/api/ai-questions` | Create AI question | Yes |
| PUT | `/api/ai-questions/{id}` | Update AI question | Yes |
| DELETE | `/api/ai-questions/{id}` | Delete AI question | Yes |
| POST | `/api/ai-questions/approve` | Approve AI questions | Yes |
| POST | `/api/ai-questions/survey/{surveyId}/add` | Add AI questions to survey | Yes |

---

## Response Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/responses` | Submit response | Yes |
| POST | `/api/responses/submit-token` | Submit response with token | No |
| GET | `/api/responses/survey/{surveyId}` | Get responses by survey | Yes |

---

## Share Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/share` | Share survey | Yes |
| GET | `/api/share/validate/{token}` | Validate share token | No |

---

## Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/analytics/survey/{surveyId}` | Get survey analytics | Yes |
| GET | `/api/analytics/survey/{surveyId}/questions` | Get question analytics | Yes |
| GET | `/api/analytics/survey/{surveyId}/audience` | Get audience analytics | Yes |

---

## Categories Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/categories/createSurveyCategory` | Create survey category | Yes |
| GET | `/api/categories/getSurveyCategory` | Get survey categories | Yes |
| POST | `/api/categories/createQuestionCategory` | Create question category | Yes |
| GET | `/api/categories/getQuestionCategory` | Get question categories | Yes |

---

## Request/Response Examples

### 1. Register User
**Request:**
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile_no": "9876543210",
  "password": "password123",
  "role": "USER",
  "theme": "LIGHT"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Create Survey
**Request:**
```json
POST /api/surveys
Authorization: Bearer <token>
{
  "title": "Customer Satisfaction Survey",
  "description": "Please rate your experience",
  "flow_type": "STATIC",
  "survey_send_by": "EMAIL",
  "status": "DRAFT",
  "scheduled_type": "IMMEDIATE",
  "autoGenerateQuestions": false
}
```

**Response (201):**
```json
{
  "message": "Survey created",
  "survey": {
    "id": "uuid",
    "title": "Customer Satisfaction Survey",
    "userId": "user-uuid",
    "no_of_questions": 0,
    "status": "DRAFT",
    "created_at": "2024-10-21T10:00:00Z"
  }
}
```

---

### 3. Create Question
**Request:**
```json
POST /api/questions
Authorization: Bearer <token>
{
  "surveyId": "survey-uuid",
  "question_type": "TEXT",
  "question_text": "What is your name?",
  "order_index": 1,
  "required": true,
  "categoryId": null,
  "options": []
}
```

**Response (201):**
```json
{
  "message": "Question created successfully",
  "question": {
    "id": "uuid",
    "surveyId": "survey-uuid",
    "question_type": "TEXT",
    "question_text": "What is your name?",
    "order_index": 1,
    "required": true,
    "options": []
  }
}
```

---

### 4. Submit Response
**Request:**
```json
POST /api/responses
Authorization: Bearer <token>
{
  "surveyId": "survey-uuid",
  "user_metadata": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "answers": [
    {
      "questionId": "question-uuid",
      "answer_value": "My answer"
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Response submitted",
  "response": {
    "id": "uuid",
    "surveyId": "survey-uuid",
    "user_metadata": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "response_answers": [...]
  }
}
```

---

### 5. Share Survey Publicly
**Request:**
```json
POST /api/share
Authorization: Bearer <token>
{
  "surveyId": "survey-uuid",
  "type": "PUBLIC",
  "recipients": []
}
```

**Response (200):**
```json
{
  "message": "Survey shared publicly",
  "link": "http://localhost:3000/survey/token-hash"
}
```

---

### 6. Get Survey Analytics
**Request:**
```
GET /api/analytics/survey/{surveyId}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "surveyId": "survey-uuid",
  "totalResponses": 25,
  "totalQuestions": 5,
  "avgCompletionRate": 0.95
}
```

---

## Data Types & Enums

### Role Enum
- `USER`
- `SYSTEM_ADMIN`

### SurveySendBy Enum
- `WHATSAPP`
- `EMAIL`
- `BOTH`
- `NONE`

### FlowType Enum
- `STATIC`
- `INTERACTIVE`
- `GAME`

### SurveyStatus Enum
- `DRAFT`
- `SCHEDULED`
- `PUBLISHED`

### ScheduleType Enum
- `IMMEDIATE`
- `SCHEDULED`

### QuestionType Enum
- `TEXT`
- `IMAGE`
- `VIDEO`
- `AUDIO`

### MediaType Enum
- `IMAGE`
- `VIDEO`
- `AUDIO`
- `DOCUMENT`

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "message": "Missing or invalid authentication token"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## Common Query Parameters

- `surveyId` - Survey identifier (UUID)
- `questionId` - Question identifier (UUID)
- `token` - Share token hash
- `addToSurvey` - Boolean flag for AI questions

---

## Rate Limiting

Currently no rate limiting is implemented. This should be added for production.

---

## Pagination

Currently no pagination is implemented. For large datasets, consider implementing:
- `limit` - Number of records per page
- `offset` - Number of records to skip
- `page` - Page number

---

## Versioning

Current API Version: **v2**

---

## Support & Documentation

- **Postman Collection:** `postman/Survey_Platform_API_Updated.postman_collection.json`
- **Environment File:** `postman/Survey_Platform_Environment_Updated.postman_environment.json`
- **Frontend Documentation:** `docs/Frontend_API_Documentation_Updated.md`
- **API Reference:** `docs/API_Reference_Guide.md`

