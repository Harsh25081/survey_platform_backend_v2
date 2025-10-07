# Survey Platform API Documentation

This directory contains comprehensive documentation and testing resources for the Survey Platform Backend v2 API.

## 📁 Contents

### Documentation Files
- **[Frontend_API_Documentation.md](./Frontend_API_Documentation.md)** - Complete guide for frontend developers
- **[API_Reference_Guide.md](./API_Reference_Guide.md)** - Comprehensive API reference with all endpoints and data models

### Postman Collection
- **[Survey_Platform_API.postman_collection.json](../postman/Survey_Platform_API.postman_collection.json)** - Complete Postman collection with all API endpoints
- **[Survey_Platform_Environment.postman_environment.json](../postman/Survey_Platform_Environment.postman_environment.json)** - Environment variables for testing

## 🚀 Quick Start

### 1. Import Postman Collection

1. Open Postman
2. Click "Import" button
3. Select the collection file: `postman/Survey_Platform_API.postman_collection.json`
4. Import the environment file: `postman/Survey_Platform_Environment.postman_environment.json`
5. Select the "Survey Platform Environment" from the environment dropdown

### 2. Configure Environment Variables

Update the following variables in your Postman environment:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `base_url` | API base URL | `http://localhost:5000` |
| `user_email` | Test user email | `john.doe@example.com` |
| `user_password` | Test user password | `password123` |
| `user_name` | Test user name | `John Doe` |
| `user_mobile` | Test user mobile | `1234567890` |

### 3. Authentication Flow

1. **Register a new user** or **Login** using the Authentication folder
2. The JWT token will be automatically saved to the `auth_token` environment variable
3. All subsequent requests will use this token automatically

### 4. Testing Workflow

Follow this sequence for complete API testing:

1. **Authentication** → Register/Login
2. **Surveys** → Create Survey → Get Surveys
3. **Questions** → Create Question → Get Questions
4. **Sharing** → Share Survey (Public/Personalized)
5. **Responses** → Submit Response (with/without token)
6. **Analytics** → Get Survey/Question/Audience Analytics

## 📖 Documentation Guide

### For Frontend Developers
Use **[Frontend_API_Documentation.md](./Frontend_API_Documentation.md)** which includes:
- Complete request/response examples
- Authentication requirements
- Error handling guidelines
- JavaScript SDK examples
- Usage best practices

### For API Reference
Use **[API_Reference_Guide.md](./API_Reference_Guide.md)** which includes:
- All endpoints with parameters
- Data models and schemas
- Error codes and messages
- Rate limiting guidelines
- Pagination information

## 🔧 API Endpoints Overview

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Surveys
- `POST /api/surveys` - Create survey
- `GET /api/surveys` - Get all surveys
- `GET /api/surveys/{id}` - Get survey by ID
- `PUT /api/surveys/{id}` - Update survey
- `DELETE /api/surveys/{id}` - Delete survey

### Questions
- `POST /api/questions` - Create question
- `GET /api/questions/survey/{surveyId}` - Get questions by survey
- `PUT /api/questions/{id}` - Update question
- `DELETE /api/questions/{id}` - Delete question

### Responses
- `POST /api/responses` - Submit response (authenticated)
- `POST /api/responses/submit-token` - Submit response with token
- `GET /api/responses/survey/{surveyId}` - Get responses by survey

### Sharing
- `POST /api/share` - Share survey
- `GET /api/share/validate/{token}` - Validate share token

### Analytics
- `GET /api/analytics/survey/{surveyId}` - Survey analytics
- `GET /api/analytics/survey/{surveyId}/questions` - Question analytics
- `GET /api/analytics/survey/{surveyId}/audience` - Audience analytics

## 🔐 Authentication

The API uses JWT (JSON Web Token) authentication:

```javascript
// Include in request headers
Authorization: Bearer <your-jwt-token>
```

### Token Management
- Tokens are issued on successful login/registration
- Store tokens securely (localStorage, sessionStorage, or secure cookies)
- Include tokens in all protected endpoint requests
- Handle token expiration gracefully

## 📊 Data Models

### Key Entities
- **User** - System users with roles and preferences
- **Survey** - Survey containers with settings and metadata
- **Question** - Individual questions with types and options
- **Response** - User responses with answers and metadata
- **ShareToken** - Tokens for survey sharing and access control

### Enums and Constants
- **User Roles**: `USER`, `SYSTEM_ADMIN`
- **Survey Status**: `DRAFT`, `SCHEDULED`, `PUBLISHED`
- **Question Types**: `TEXT`, `MCQ`, `RATING`, `IMAGE`, `VIDEO`, `AUDIO`, `FILE`, `MATRIX`
- **Flow Types**: `STATIC`, `INTERACTIVE`, `GAME`
- **Share Types**: `PUBLIC`, `PERSONALIZED`

## ⚠️ Error Handling

### HTTP Status Codes
- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "message": "Error description"
}
```

## 🔄 Testing Best Practices

### 1. Environment Setup
- Use separate environments for development, staging, and production
- Keep sensitive data (passwords, tokens) secure
- Use meaningful test data

### 2. Test Sequence
- Always authenticate before testing protected endpoints
- Create surveys before adding questions
- Create questions before submitting responses
- Test both success and error scenarios

### 3. Data Cleanup
- Delete test surveys after testing
- Use unique identifiers for test data
- Reset environment variables as needed

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Postman (for API testing)

### Environment Variables
Create a `.env` file with:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/survey_platform"
JWT_SECRET="your-jwt-secret"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### Running the Server
```bash
npm install
npm run dev
```

## 📞 Support

For questions or issues:
- Check the documentation files in this directory
- Review the Postman collection examples
- Refer to the API reference guide
- Check server logs for debugging

## 📝 Notes

- All timestamps are in ISO 8601 format
- UUIDs are used for all entity identifiers
- JSON is the only supported content type
- CORS is enabled for cross-origin requests
- Swagger documentation is available at `/api-docs` when server is running

---

**Last Updated**: January 2024  
**API Version**: v2  
**Documentation Version**: 1.0
