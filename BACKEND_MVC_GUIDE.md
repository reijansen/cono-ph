# Backend MVC Implementation Guide
## For Backend Developer

---

## Overview

Your frontend is adopting an **MVC-style component-based architecture**. This guide ensures your backend provides the correct API contracts, error handling, and response formats.

Your tech stack: **Node.js + Express + PostgreSQL (Neon)**

---

## Recommended Backend Architecture

```
Request Flow:
Route → Auth Middleware → Validation Middleware → Controller 
  ↓
Service Layer (Business Logic)
  ↓
Repository Layer (Data Access)
  ↓
PostgreSQL (Neon)
  ↓ Response
JSON → Frontend
```

**Directory Structure:**
```
backend/
├── config/
│   ├── db.js              # Database connection (existing)
│   └── env.js             # Environment variables
├── middleware/            # (NEW) Cross-cutting concerns
│   ├── validation.js      # Input validation (Zod)
│   ├── errorHandler.js    # Global error handling
│   ├── auth.js            # JWT auth (future)
│   └── asyncHandler.js    # Async wrapper
├── models/                # (NEW) Database schemas
│   └── species.model.js   # Zod schemas for validation
├── repositories/          # (NEW) Data access layer
│   └── speciesRepository.js
├── services/              # (NEW) Business logic
│   └── speciesService.js
├── controllers/           # (EXISTING) HTTP handlers
│   └── speciesControllers.js (refactor to use services)
├── routes/                # (EXISTING) Route definitions
│   └── speciesRoutes.js
├── utils/                 # (NEW) Helpers
│   ├── response.js        # Standardized response format
│   ├── errors.js          # Custom error classes
│   └── validators.js      # Validation schemas
├── lib/                   # (EXISTING) External integrations
│   └── arcjet.js
└── server.js              # (EXISTING) Main entry
```

---

## Implementation Layers (Suggested Order)

### **Layer 1: Validation & Error Handling Middleware**

**Files to create:**
- `utils/response.js` - Standardized response format
- `utils/errors.js` - Custom error classes
- `middleware/errorHandler.js` - Global error handler
- `middleware/asyncHandler.js` - Wrapper for async routes

**Key functions:**
```javascript
// response.js
export const sendResponse = (res, statusCode, success, data, message) => {
  res.status(statusCode).json({ success, data, message });
};

// errors.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// errorHandler.js (middleware)
app.use((err, req, res, next) => {
  // Handle all errors uniformly
});
```

---

### **Layer 2: Models & Validation Schemas**
**Why second:** Define data contracts before using them

**Files to create:**
- `models/species.model.js` - Zod schemas for validation
- `utils/validators.js` - Reusable validators

**Package to install:** `npm install zod`

**Key schemas:**
```javascript
export const speciesCreateSchema = z.object({
  scientific_name: z.string().min(1).max(255),
  common_name: z.string().min(1).max(255),
  num_related_publications: z.number().int().min(0)
});

export const speciesUpdateSchema = speciesCreateSchema.partial();
```

---

### **Layer 3: Repository Layer (Data Access)**
**Why third:** Isolate database logic from business logic

**Files to create:**
- `repositories/speciesRepository.js` - All database queries

**Key methods:**
```javascript
export class SpeciesRepository {
  static async getAll(filters = {}) { }
  static async getById(id) { }
  static async create(data) { }
  static async update(id, data) { }
  static async delete(id) { }
}
```

---

### **Layer 4: Service Layer (Business Logic)**
**Why fourth:** Orchestrate repositories, apply business rules

**Files to create:**
- `services/speciesService.js` - Business logic

**Key methods:**
```javascript
export class SpeciesService {
  static async getAllSpecies(filters) {
    // Validate filters
    // Call repository
    // Transform data
    // Return to controller
  }
}
```

---

### **Layer 5: Refactor Controllers**
**Why last:** Now controllers are thin, just handle HTTP

**File to update:**
- `controllers/speciesControllers.js` - Refactor to use services

**Pattern:**
```javascript
export const getAllSpecies = asyncHandler(async (req, res) => {
  const data = await SpeciesService.getAllSpecies(req.query);
  sendResponse(res, 200, true, data, 'Fetched successfully');
});
```

---

## API Response Format (CRITICAL)

**All responses must follow this format:**

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "message": "User-friendly error message",
  "error": "error_code_for_debugging"
}
```

---

## Endpoint Specifications

All endpoints return the response format above. HTTP status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### **GET /api/species** (List all)
```javascript
Query params: ?page=1&limit=10&search=&sortBy=created_at&order=DESC

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "scientific_name": "Conus geographus",
      "common_name": "Geography cone",
      "num_related_publications": 45,
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-01-15T10:30:00Z"
    }
  ],
  "message": "Species retrieved successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### **GET /api/species/:id** (Get single)
```javascript
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "scientific_name": "Conus geographus",
    "common_name": "Geography cone",
    "num_related_publications": 45,
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  },
  "message": "Species retrieved successfully"
}
```

### **POST /api/species** (Create)
```javascript
Request body:
{
  "scientific_name": "Conus textile",
  "common_name": "Cloth cone",
  "num_related_publications": 32
}

Response: 201
{
  "success": true,
  "data": { ...species object with id },
  "message": "Species created successfully"
}
```

### **PUT /api/species/:id** (Update)
```javascript
Request body (all optional):
{
  "scientific_name": "Updated name",
  "common_name": "Updated common",
  "num_related_publications": 40
}

Response: 200
{
  "success": true,
  "data": { ...updated species object },
  "message": "Species updated successfully"
}
```

### **DELETE /api/species/:id** (Delete)
```javascript
Response: 200
{
  "success": true,
  "data": { "id": 1 },
  "message": "Species deleted successfully"
}
```

---

## Key Implementation Details

### **Error Handling**
```javascript
// Don't do this:
catch (error) {
  res.status(500).json({ error: error.message });
}

// Do this:
catch (error) {
  if (error instanceof ValidationError) {
    throw new AppError(error.message, 400);
  }
  throw new AppError('Internal server error', 500);
}

// Handler catches and formats uniformly
```

### **Validation**
```javascript
// Don't do this:
if (!scientific_name) {
  return res.status(400).json({ error: 'Name required' });
}

// Do this:
const schema = speciesCreateSchema;
const { data, error } = schema.safeParse(req.body);
if (error) throw new AppError(error.message, 400);
```

### **Async/Await**
```javascript
// Don't do this:
app.post('/species', (req, res) => {
  // If error throws, server crashes
  await db.query(...);
});

// Do this:
app.post('/species', asyncHandler(async (req, res) => {
  // asyncHandler catches and passes to error middleware
  await db.query(...);
}));
```

---

## Dependencies to Install

```bash
npm install zod      # Validation
npm install express  # Already have
npm install dotenv   # Already have
```

**Optional (for production):**
```bash
npm install winston  # Better logging
npm install @joi/joi # Alternative validation
```

---

## Data Flow Example

**Request:** `GET /api/species?page=1&limit=5`

```
1. Route matches → speciesRoutes.js
2. Middleware runs:
   - Validation (check query params)
   - Auth (if needed)
3. Controller: getAllSpecies
   ↓
4. Service: SpeciesService.getAllSpecies()
   - Validates filters
   - Calls repository
   - Formats response
   ↓
5. Repository: SpeciesRepository.getAll()
   - Executes SQL: SELECT * FROM species...
   - Returns raw data
   ↓
6. Database: PostgreSQL (Neon)
   - Returns rows
   ↓
7. Response travels back up
8. sendResponse() formats it
9. Returns to frontend
```

---

## Implementation Checklist

- [ ] Install `zod`
- [ ] Create `utils/response.js` - Standardized responses
- [ ] Create `utils/errors.js` - Custom error class
- [ ] Create `middleware/errorHandler.js` - Global error handler
- [ ] Create `middleware/asyncHandler.js` - Async wrapper
- [ ] Create `models/species.model.js` - Validation schemas
- [ ] Create `repositories/speciesRepository.js` - Data access
- [ ] Create `services/speciesService.js` - Business logic
- [ ] Refactor `controllers/speciesControllers.js` - Use services
- [ ] Update `routes/speciesRoutes.js` - Use asyncHandler
- [ ] Update `server.js` - Register error middleware
- [ ] Test all endpoints with postman/insomnia
- [ ] Document API in README

---

## Tips for Success

1. **Keep layers independent** - Each layer should only know about the layer below it
2. **Test each layer separately** - Repository tests, then service tests, etc.
3. **Use try-catch in services, not controllers** - Controllers use asyncHandler
4. **Validate early** - Validate at middleware, not in controller
5. **Document your schemas** - Zod schemas are your API contract with frontend
6. **Use consistent field naming** - snake_case in DB, camelCase in API? Decide and document

---

## Coordination with Frontend

- **Frontend** is building Zustand store + hooks
- **Backend** provides these exact endpoints/formats
- **No surprises** - If either side deviates, let each other know immediately
- **Frontend checks:** Use `/FRONTEND_MVC_GUIDE.md` for response format expectations

---

## Questions to Answer Together

1. Should API return `camelCase` or `snake_case`? (Decide now)
2. Should timestamps be ISO-8601 or Unix? (ISO-8601 recommended)
3. Should IDs be UUIDs or auto-increment? (Keep current for now)
4. Do we need JWT auth? (Plan for Phase 2)
5. Do we need pagination for all list endpoints? (Yes)
6. Should we implement soft-deletes? (Discuss with team)

---

## Resources

- Zod Docs: https://zod.dev
- Express Best Practices: https://expressjs.com/en/advanced/best-practice-performance.html
- RESTful API Design: https://restfulapi.net

---

**Next:** Once you have these layers implemented, notify frontend so they can finalize the API service contracts.