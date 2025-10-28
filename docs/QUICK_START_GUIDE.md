# Survey Platform API - Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Postman (for API testing)
- Git

---

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd survey_platform_backend_v2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/survey_platform_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Port
PORT=5000

# OpenAI API Key (for AI question generation)
OPENAI_API_KEY="your-openai-api-key-here"

# Node Environment
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### 4. Setup Database

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## API Testing with Postman

### 1. Import Postman Collection

1. Open Postman
2. Click "Import" button
3. Select file: `postman/Survey_Platform_API_Updated.postman_collection.json`
4. Click "Import"

### 2. Import Environment

1. Click "Environments" in left sidebar
2. Click "Import"
3. Select file: `postman/Survey_Platform_Environment_Updated.postman_environment.json`
4. Click "Import"

### 3. Select Environment

1. Click environment dropdown (top-right)
2. Select "Survey Platform Environment"

### 4. Test Workflow

Follow this sequence to test the API:

#### Step 1: Register User
1. Go to "Authentication" → "Register User"
2. Click "Send"
3. Token will be automatically saved to environment

#### Step 2: Create Survey
1. Go to "Surveys" → "Create Survey"
2. Click "Send"
3. Survey ID will be automatically saved

#### Step 3: Create Question
1. Go to "Questions" → "Create Question"
2. Click "Send"
3. Question ID will be automatically saved

#### Step 4: Submit Response
1. Go to "Responses" → "Submit Response"
2. Click "Send"

#### Step 5: Share Survey
1. Go to "Share Survey" → "Share Survey Publicly"
2. Click "Send"
3. Share token will be automatically saved

#### Step 6: Get Analytics
1. Go to "Analytics" → "Get Survey Analytics"
2. Click "Send"

---

## Common API Workflows

### Workflow 1: Create and Publish Survey

```
1. POST /api/auth/signup → Get token
2. POST /api/surveys → Create survey
3. POST /api/questions → Add questions (repeat for each)
4. PUT /api/surveys/{id} → Update status to PUBLISHED
5. POST /api/share → Share survey
```

### Workflow 2: Collect Responses

```
1. GET /api/share/validate/{token} → Validate token
2. POST /api/responses/submit-token → Submit response
3. GET /api/responses/survey/{surveyId} → Get all responses
```

### Workflow 3: Analyze Results

```
1. GET /api/analytics/survey/{surveyId} → Survey stats
2. GET /api/analytics/survey/{surveyId}/questions → Question stats
3. GET /api/analytics/survey/{surveyId}/audience → Audience stats
```

### Workflow 4: AI Question Generation

```
1. POST /api/surveys → Create survey with autoGenerateQuestions: true
2. GET /api/ai-questions/survey/{surveyId} → Get generated questions
3. POST /api/ai-questions/approve → Approve questions
4. POST /api/ai-questions/survey/{surveyId}/add → Add to survey
```

---

## Response Examples

### Successful Response (200/201)
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response (400/401/404/500)
```json
{
  "message": "Error description"
}
```

---

## Debugging Tips

### 1. Check Server Logs
```bash
# Terminal where server is running
npm run dev
```

### 2. Verify Database Connection
```bash
# Test connection
npx prisma db execute --stdin < test.sql
```

### 3. Check JWT Token
- Decode token at https://jwt.io
- Verify expiration and payload

### 4. Postman Console
- Click "Console" at bottom of Postman
- View request/response details

### 5. Database Inspection
```bash
# Open Prisma Studio
npx prisma studio
```

---

## Troubleshooting

### Issue: "Cannot find module"
**Solution:** Run `npm install` again

### Issue: "Database connection failed"
**Solution:** 
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check credentials

### Issue: "JWT token invalid"
**Solution:**
- Verify JWT_SECRET in .env
- Check token expiration
- Re-login to get new token

### Issue: "CORS error"
**Solution:**
- CORS is enabled in app.js
- Check frontend URL in FRONTEND_URL env var

### Issue: "Port already in use"
**Solution:**
```bash
# Change PORT in .env or kill process
lsof -i :5000
kill -9 <PID>
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

---

## API Documentation Files

- **Frontend Documentation:** `docs/Frontend_API_Documentation_Updated.md`
- **API Reference:** `docs/API_Reference_Guide.md`
- **Endpoints Summary:** `docs/API_ENDPOINTS_SUMMARY.md`
- **Database Schema:** `docs/DATABASE_SCHEMA_DOCUMENTATION.md`
- **Postman Collection:** `postman/Survey_Platform_API_Updated.postman_collection.json`
- **Environment File:** `postman/Survey_Platform_Environment_Updated.postman_environment.json`

---

## Next Steps

1. **Customize:** Modify endpoints and models as needed
2. **Test:** Run comprehensive tests with Postman
3. **Deploy:** Set up production environment
4. **Monitor:** Implement logging and monitoring
5. **Scale:** Add caching and optimize queries

---

## Support

For issues or questions:
1. Check documentation files
2. Review Postman collection examples
3. Check server logs
4. Contact development team

---

## Security Checklist

- [ ] Change JWT_SECRET to strong value
- [ ] Set NODE_ENV to "production"
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Implement CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Implement logging
- [ ] Add error handling

---

## Performance Optimization

- Add database indexes
- Implement caching (Redis)
- Use pagination for large datasets
- Optimize queries with Prisma
- Implement request compression
- Use CDN for static files
- Monitor database performance
- Implement query timeouts

---

## Version Information

- **API Version:** v2
- **Node.js:** v14+
- **Express:** v4.18.3
- **Prisma:** v5.12.0
- **PostgreSQL:** v12+
- **JWT:** jsonwebtoken v9.0.2

