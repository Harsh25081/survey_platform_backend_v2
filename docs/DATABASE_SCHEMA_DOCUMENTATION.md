# Survey Platform - Database Schema Documentation

## Overview

The Survey Platform uses PostgreSQL as the database with Prisma ORM for data management. This document describes all tables, relationships, and data types.

---

## Enums

### Role
```
SYSTEM_ADMIN
USER
```

### SurveySendBy
```
WHATSAPP
EMAIL
BOTH
NONE
```

### FlowType
```
STATIC
INTERACTIVE
GAME
```

### SurveyStatus
```
DRAFT
SCHEDULED
PUBLISHED
```

### ScheduleType
```
IMMEDIATE
SCHEDULED
```

### MediaType
```
IMAGE
VIDEO
AUDIO
DOCUMENT
```

### QuestionType
```
TEXT
IMAGE
VIDEO
AUDIO
```

---

## Tables

### User
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | String | NOT NULL | User's full name |
| email | String | UNIQUE, NOT NULL | User's email address |
| mobile_no | String | UNIQUE, OPTIONAL | User's mobile number |
| password | String | NOT NULL | Hashed password |
| role | Role | DEFAULT: USER | User role |
| theme | String | DEFAULT: LIGHT | UI theme preference |
| created_at | DateTime | DEFAULT: now() | Creation timestamp |
| updated_at | DateTime | AUTO UPDATE | Last update timestamp |

**Relationships:**
- One-to-Many: surveys

---

### Survey
Stores survey information and metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | String | NOT NULL | Survey title |
| description | String | OPTIONAL | Survey description |
| no_of_questions | Int | DEFAULT: 0 | Number of questions |
| userId | UUID | FOREIGN KEY | Owner user ID |
| survey_send_by | SurveySendBy | DEFAULT: NONE | Distribution method |
| flow_type | FlowType | DEFAULT: STATIC | Survey flow type |
| settings | JSON | DEFAULT: {} | Additional settings |
| status | SurveyStatus | DEFAULT: DRAFT | Survey status |
| scheduled_date | DateTime | OPTIONAL | Scheduled publish date |
| scheduled_type | ScheduleType | DEFAULT: IMMEDIATE | Schedule type |
| is_deleted | Boolean | DEFAULT: false | Soft delete flag |
| surveyCategoryId | UUID | OPTIONAL, FK | Survey category |
| autoGenerateQuestions | Boolean | DEFAULT: false | AI generation flag |
| created_at | DateTime | DEFAULT: now() | Creation timestamp |
| updated_at | DateTime | AUTO UPDATE | Last update timestamp |

**Relationships:**
- Many-to-One: User (userId)
- Many-to-One: SurveyCategory (surveyCategoryId)
- One-to-Many: Question
- One-to-Many: Response
- One-to-Many: ShareToken
- One-to-Many: SurveyAudience
- One-to-Many: AIGeneratedQuestion

---

### Question
Stores individual survey questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| surveyId | UUID | FOREIGN KEY | Parent survey |
| question_type | QuestionType | NOT NULL | Type of question |
| question_text | String | NOT NULL | Question text |
| order_index | Int | DEFAULT: 0 | Display order |
| required | Boolean | DEFAULT: true | Is required |
| categoryId | UUID | OPTIONAL, FK | Question category |
| mediaId | UUID | OPTIONAL, FK | Attached media |
| created_at | DateTime | DEFAULT: now() | Creation timestamp |
| updated_at | DateTime | AUTO UPDATE | Last update timestamp |

**Relationships:**
- Many-to-One: Survey (surveyId)
- Many-to-One: QuestionCategory (categoryId)
- Many-to-One: MediaAsset (mediaId)
- One-to-Many: Option (multiple relations)
- One-to-Many: ResponseAnswer

---

### Option
Stores answer options for questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| text | String | OPTIONAL | Option text |
| mediaId | UUID | OPTIONAL, UNIQUE, FK | Attached media |
| questionId | UUID | FOREIGN KEY | Parent question |
| rowQuestionOptionId | UUID | OPTIONAL, FK | Row reference (grid) |
| columnQuestionOptionId | UUID | OPTIONAL, FK | Column reference (grid) |
| rangeFrom | Int | OPTIONAL | Scale start value |
| rangeTo | Int | OPTIONAL | Scale end value |
| fromLabel | String | OPTIONAL | Scale start label |
| toLabel | String | OPTIONAL | Scale end label |
| icon | String | OPTIONAL | Icon identifier |

**Relationships:**
- Many-to-One: Question (questionId)
- Many-to-One: Question (rowQuestionOptionId)
- Many-to-One: Question (columnQuestionOptionId)
- One-to-One: MediaAsset (mediaId)
- One-to-Many: ResponseAnswer

---

### MediaAsset
Stores media files and metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| type | MediaType | NOT NULL | Media type |
| url | String | NOT NULL | Media URL |
| thumbnail_url | String | OPTIONAL | Thumbnail URL |
| uploaded_by | String | DEFAULT: Anonymous | Uploader name |
| meta | JSON | DEFAULT: {} | Additional metadata |
| created_at | DateTime | DEFAULT: now() | Creation timestamp |

**Relationships:**
- One-to-One: Option
- One-to-Many: Question
- One-to-Many: ResponseAnswer

---

### Response
Stores survey responses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| surveyId | UUID | FOREIGN KEY | Parent survey |
| user_metadata | JSON | DEFAULT: {} | Respondent metadata |
| created_at | DateTime | DEFAULT: now() | Submission timestamp |

**Relationships:**
- Many-to-One: Survey (surveyId)
- One-to-Many: ResponseAnswer

---

### ResponseAnswer
Stores individual answers within a response.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| responseId | UUID | FOREIGN KEY | Parent response |
| questionId | UUID | FOREIGN KEY | Question answered |
| answer_value | String | OPTIONAL | Text answer |
| mediaId | UUID | OPTIONAL, FK | Attached media |
| selected_option_ids | JSON | OPTIONAL | Selected option IDs |
| scaleRatingValue | Int | OPTIONAL | Rating value |
| submitted_at | DateTime | DEFAULT: now() | Submission time |
| created_at | DateTime | DEFAULT: now() | Creation timestamp |

**Relationships:**
- Many-to-One: Response (responseId)
- Many-to-One: Question (questionId)
- Many-to-One: MediaAsset (mediaId)
- One-to-Many: GridResponseAnswer
- Many-to-Many: Option

---

### GridResponseAnswer
Stores grid question responses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| responseAnswerId | UUID | FOREIGN KEY | Parent response answer |
| rowOptionId | String | NOT NULL | Selected row |
| columnOptionId | String | NOT NULL | Selected column |
| selected | Boolean | DEFAULT: false | Is selected |

**Relationships:**
- Many-to-One: ResponseAnswer (responseAnswerId)

---

### ShareToken
Stores survey sharing tokens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| surveyId | UUID | FOREIGN KEY | Shared survey |
| recipient_email | String | OPTIONAL | Recipient email |
| recipient_mobile | String | OPTIONAL | Recipient mobile |
| token_hash | String | NOT NULL | Token hash |
| expires_at | DateTime | OPTIONAL | Expiration time |
| used | Boolean | DEFAULT: false | Is used |
| created_at | DateTime | DEFAULT: now() | Creation timestamp |

**Relationships:**
- Many-to-One: Survey (surveyId)

---

### QuestionCategory
Stores question type categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| type_name | String | UNIQUE, NOT NULL | Category name |
| settings | JSON | DEFAULT: {} | Category settings |

**Relationships:**
- One-to-Many: Question

---

### SurveyCategory
Stores survey categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | String | UNIQUE, NOT NULL | Category name |

**Relationships:**
- One-to-Many: Survey

---

### SurveyAudience
Stores survey audience members.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| surveyId | UUID | FOREIGN KEY | Parent survey |
| name | String | OPTIONAL | Audience member name |
| email | String | OPTIONAL | Email address |
| mobile_no | String | OPTIONAL | Mobile number |
| attributes | JSON | DEFAULT: {} | Custom attributes |
| created_at | DateTime | DEFAULT: now() | Creation timestamp |
| updated_at | DateTime | AUTO UPDATE | Last update timestamp |

**Relationships:**
- Many-to-One: Survey (surveyId)

---

### MasterAudience
Stores master audience data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | String | OPTIONAL | Audience member name |
| email | String | OPTIONAL | Email address |
| mobile_no | String | OPTIONAL | Mobile number |
| attributes | JSON | DEFAULT: {} | Custom attributes |

---

### AIGeneratedQuestion
Stores AI-generated questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| surveyId | UUID | FOREIGN KEY | Parent survey |
| question_type | QuestionType | NOT NULL | Question type |
| question_text | String | NOT NULL | Question text |
| options | JSON | DEFAULT: [] | Answer options |
| order_index | Int | DEFAULT: 0 | Display order |
| required | Boolean | DEFAULT: true | Is required |
| ai_prompt | String | OPTIONAL | Generation prompt |
| ai_model | String | OPTIONAL | AI model used |
| confidence_score | Float | OPTIONAL | Confidence score |
| is_approved | Boolean | DEFAULT: false | Approval status |
| is_added_to_survey | Boolean | DEFAULT: false | Added to survey |
| created_at | DateTime | DEFAULT: now() | Creation timestamp |
| updated_at | DateTime | AUTO UPDATE | Last update timestamp |

**Relationships:**
- Many-to-One: Survey (surveyId)

---

## Relationships Summary

### One-to-Many
- User → Survey
- Survey → Question
- Survey → Response
- Survey → ShareToken
- Survey → SurveyAudience
- Survey → AIGeneratedQuestion
- Question → Option
- Question → ResponseAnswer
- Response → ResponseAnswer
- ResponseAnswer → GridResponseAnswer
- QuestionCategory → Question
- SurveyCategory → Survey

### Many-to-One
- Survey → User
- Survey → SurveyCategory
- Question → Survey
- Question → QuestionCategory
- Question → MediaAsset
- Option → Question
- Response → Survey
- ResponseAnswer → Response
- ResponseAnswer → Question
- ResponseAnswer → MediaAsset
- GridResponseAnswer → ResponseAnswer
- ShareToken → Survey
- SurveyAudience → Survey
- AIGeneratedQuestion → Survey

### One-to-One
- Option → MediaAsset

### Many-to-Many
- ResponseAnswer ↔ Option

---

## Indexes

Recommended indexes for performance:
- User.email (UNIQUE)
- User.mobile_no (UNIQUE)
- Survey.userId
- Survey.is_deleted
- Question.surveyId
- Question.order_index
- Response.surveyId
- ResponseAnswer.responseId
- ResponseAnswer.questionId
- ShareToken.token_hash
- ShareToken.surveyId
- AIGeneratedQuestion.surveyId

---

## Constraints

- All IDs are UUIDs (auto-generated)
- Timestamps are ISO 8601 format
- Soft deletes use is_deleted flag
- Foreign keys enforce referential integrity
- Unique constraints on email and mobile_no in User table

