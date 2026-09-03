# Card Validation API

> A production-ready REST API for validating credit card numbers using the Luhn algorithm with TypeScript and Express.js

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0.0-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/express-4.18.2-lightgrey)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Validate Card Endpoint](#validate-card-endpoint)
  - [Health Check](#health-check)
  - [API Examples](#api-examples)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Security Considerations](#security-considerations)
- [Performance Optimizations](#performance-optimizations)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This API provides a single endpoint that validates credit card numbers using the **Luhn algorithm** (mod 10 algorithm), the industry-standard checksum formula used to validate various identification numbers, including credit cards. The service accepts card numbers in multiple formats, detects card types, and returns clear validation results with appropriate HTTP status codes.

The implementation follows **clean architecture** principles with clear separation of concerns, making it maintainable, testable, and extensible.

---

## Features

### Core Functionality

- **Luhn Algorithm Validation**: Industry-standard checksum validation for credit cards
- **Card Type Detection**: Automatically identifies Visa, Mastercard, Amex, and Discover cards
- **Flexible Input Formats**: Accepts numbers with spaces, dashes, or continuous digits
- **Comprehensive Validation**: Length validation, character validation, and format validation

### API Features

- **Rate Limiting**: Configurable request limits to prevent abuse (100 requests per 15 minutes)
- **Secure Headers**: Helmet.js for security headers protection
- **CORS Support**: Controlled cross-origin resource sharing
- **Consistent Error Responses**: Structured error format across all endpoints
- **Request Validation**: Thorough input validation before processing

### Development Features

- **TypeScript Strict Mode**: Full type safety with `strict: true` in tsconfig.json
- **Error Handling**: Graceful error handling with appropriate HTTP status codes
- **Logging**: Request/response logging for debugging and monitoring
- **Testing**: Unit and integration tests with Jest

---

## Tech Stack

| Technology         | Version | Purpose                       |
| ------------------ | ------- | ----------------------------- |
| Node.js            | ≥14.0.0 | Runtime environment           |
| TypeScript         | ≥6.0.0  | Type-safe JavaScript superset |
| Express.js         | 4.18.2  | Web framework                 |
| Helmet             | 7.0.0   | Security headers middleware   |
| CORS               | 2.8.5   | Cross-origin resource sharing |
| Express Rate Limit | 6.7.0   | Rate limiting middleware      |
| Jest               | 29.5.0  | Testing framework             |
| Supertest          | 6.3.3   | HTTP assertions for testing   |
| Nodemon            | 2.0.22  | Development auto-restart      |

---

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/fantuhmloop/card-validation-api.git
cd card-validation-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Build the project
npm run build

# 5. Run the application
npm start
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=100    # Maximum requests per window

# Logging (optional)
LOG_LEVEL=info
```

### TypeScript Configuration

The project uses strict TypeScript mode with the following key settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Build Only

```bash
npm run build
```

### Verify Installation

```bash
curl http://localhost:3000/health
# Response: {"status":"OK","timestamp":"..."}
```

---

## API Documentation

### Base URL

```bash
curl http://localhost:3000/api/v1
```

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2026-09-03T10:30:00.000Z"
}
```

---

### Validate Card Endpoint

```http
POST /api/v1/validate
```

**Request Headers:**

```text
Content-Type: application/json
```

**Request Body:**

```json
{
  "cardNumber": "4111-1111-1111-1111"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "cardNumber": "4111-1111-1111-1111",
    "cardType": "Visa",
    "message": "Card number is valid"
  },
  "timestamp": "2026-09-03T10:30:00.000Z"
}
```

**Validation Failure Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "valid": false,
    "cardNumber": "1234567890123456",
    "cardType": "Unknown",
    "message": "Card number is invalid"
  },
  "timestamp": "2026-09-03T10:30:00.000Z"
}
```

**Error Responses:**

| Status | Scenario            | Response Example                                                                    |
| ------ | ------------------- | ----------------------------------------------------------------------------------- |
| 400    | Missing cardNumber  | `{"status":400,"message":"Missing required field: cardNumber"}`                     |
| 400    | Invalid characters  | `{"status":400,"message":"cardNumber must contain only digits, spaces, or dashes"}` |
| 400    | Non-string input    | `{"status":400,"message":"cardNumber must be a string"}`                            |
| 400    | Too short           | `{"status":400,"message":"Card number must be at least 13 digits"}`                 |
| 400    | Too long            | `{"status":400,"message":"Card number must not exceed 19 digits"}`                  |
| 429    | Rate limit exceeded | `{"status":429,"message":"Too many requests, please try again later."}`             |
| 404    | Route not found     | `{"status":404,"message":"Route not found"}`                                        |
| 500    | Server error        | `{"status":500,"message":"Internal server error"}`                                  |

---

### API Examples

#### cURL

**Valid Visa Card:**

```bash
curl -X POST http://localhost:3000/api/v1/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111111111111111"}'
```

**Card with Spaces:**

```bash
curl -X POST http://localhost:3000/api/v1/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111 1111 1111 1111"}'
```

**Invalid Card:**

```bash
curl -X POST http://localhost:3000/api/v1/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "1234567890123456"}'
```

#### JavaScript (fetch)

```javascript
async function validateCard(cardNumber) {
  const response = await fetch("http://localhost:3000/api/v1/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardNumber }),
  });
  return await response.json();
}

// Usage
validateCard("4111-1111-1111-1111").then((result) => console.log(result));
```

#### Python (requests)

```python
import requests

def validate_card(card_number):
    response = requests.post(
        'http://localhost:3000/api/v1/validate',
        json={'cardNumber': card_number}
    )
    return response.json()

# Usage
result = validate_card('4111-1111-1111-1111')
print(result)
```

---

## Error Handling

### Error Response Format

All errors follow a consistent structure:

```json
{
  "status": <HTTP status code>,
  "message": "<Human-readable error message>",
  "timestamp": "<ISO 8601 timestamp>"
}
```

### Error Types

#### 1. Validation Errors (400)

- Missing required fields
- Invalid data types
- Invalid characters
- Length violations

#### 2. Rate Limiting Errors (429)

- Too many requests in a short period

#### 3. Not Found Errors (404)

- Invalid routes
- Endpoint doesn't exist

#### 4. Server Errors (500)

- Unexpected runtime errors
- System failures

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The test suite covers:

- Luhn algorithm validation
- Card type detection
- Input validation (all error scenarios)
- API endpoints (success and error cases)
- Edge cases (empty strings, special characters, etc.)
- Rate limiting functionality

### Example Test

```typescript
test("should validate a valid Visa card number", async () => {
  const response = await request(app)
    .post("/api/v1/validate")
    .send({ cardNumber: "4111111111111111" })
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.data.valid).toBe(true);
  expect(response.body.data.cardType).toBe("Visa");
});
```

---

## Project Structure

```text
card-validation-api/
├── src/
│   ├── server.ts                    # Application entry point
│   ├── app.ts                       # Express app configuration
│   ├── routes/
│   │   └── validation.routes.ts     # API route definitions
│   ├── controllers/
│   │   └── validation.controller.ts # Request handlers
│   ├── services/
│   │   └── validation.service.ts    # Business logic layer
│   ├── validators/
│   │   └── validation.validator.ts  # Input validation middleware
│   ├── middleware/
│   │   ├── error.middleware.ts      # Global error handlers
│   │   └── rate-limit.middleware.ts # Rate limiting configuration
│   ├── types/
│   │   └── validation.types.ts      # TypeScript interfaces
│   └── utils/
│       └── luhn.util.ts             # Luhn algorithm implementation
├── tests/
│   └── validation.test.ts           # Unit and integration tests
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore file
├── jest.config.js                   # Jest configuration
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Project documentation
```

---

## Design Decisions

### Why Express.js over NestJS?

- **Simplicity**: For a single endpoint API, Express provides a lightweight solution with less overhead
- **Learning Curve**: Express is easier to set up and understand for a focused assessment
- **Flexibility**: Express allows more direct control over request/response handling
- **Size**: Smaller footprint for a microservice-style API
- **Familiarity**: Common choice for Node.js APIs, making it easier for reviewers to understand

### Why Luhn Algorithm?

- **Industry Standard**: Widely used for credit card validation (ISO/IEC 7812)
- **Simplicity**: Easy to implement and explain
- **Efficiency**: Fast computation with minimal overhead
- **Reliability**: Catches common data entry errors (single digit errors, transpositions)

### Input Flexibility

The endpoint accepts card numbers in multiple formats because:

- Users may include spaces or dashes from copying numbers
- Improves user experience by being forgiving
- Reduces client-side preprocessing requirements

### Response Structure

The `{ success: boolean, data: object, timestamp: string }` format was chosen because:

- **Success field**: Allows frontend to quickly check response status without parsing status codes
- **Data object**: Encapsulates all relevant validation results
- **Timestamp**: Useful for logging and debugging

### Error Responses Format

Consistent error responses with status codes and human-readable messages:

- **Status field**: Matches HTTP status code for consistency
- **Message**: Clear error description for developers and users
- **Timestamp**: Helps with debugging and log correlation
- **Suggestions**: Gives suggestions on how to go about the error

---

## Security Considerations

### Implemented Security Features

1. **Helmet.js**: Sets security-related HTTP headers
   - X-Frame-Options (prevent clickjacking)
   - X-XSS-Protection (cross-site scripting protection)
   - X-Content-Type-Options (MIME sniffing prevention)
   - Strict-Transport-Security (enforce HTTPS)

2. **Rate Limiting**: Protects against abuse and DoS attacks
   - 100 requests per 15-minute window per IP
   - Configurable limits via environment variables

3. **Input Validation**: Validates all input before processing
   - Type checking (must be string)
   - Format validation (only digits, spaces, dashes)
   - Length validation (13-19 digits)
   - No raw data processing

4. **CORS**: Controlled cross-origin access
   - Configured for specific origins (configurable)
   - Prevents unauthorized domain access

5. **Error Handling**: No sensitive information exposed
   - Generic error messages for server errors
   - Stack traces hidden in production

### Recommendations for Production

- [ ] Enable HTTPS with a valid SSL certificate
- [ ] Implement API key authentication or JWT
- [ ] Add request logging for audit purposes
- [ ] Set up monitoring and alerting
- [ ] Use a production-grade database for rate limiting
- [ ] Implement IP whitelisting for administrative endpoints

---

## Performance Optimizations

### Current Optimizations

- **Non-blocking I/O**: Express/Node.js event-driven architecture
- **Lightweight Dependencies**: Minimal third-party libraries
- **Efficient Algorithm**: O(n) Luhn validation with single pass
- **Request Validation Early**: Fails fast to prevent unnecessary processing

### Potential Future Optimizations

- **Response Caching**: Cache validation results for repeated requests
- **Batch Validation**: Support array of card numbers for bulk processing
- **Worker Threads**: Offload heavy validation to worker threads
- **CDN Edge Computing**: Deploy validation closer to users

---

## Future Improvements

### Short-term Enhancements

- [ ] Add Swagger/OpenAPI documentation
- [ ] Implement batch validation endpoint
- [ ] Add card BIN/IIN lookup (issuer identification)
- [ ] Support more card types (JCB, Diners Club, etc.)
- [ ] Add request logging with Winston or Pino
- [ ] Implement request ID tracking for tracing

### Long-term Vision

- [ ] Build a full payment validation suite
- [ ] Integration with payment gateways (Stripe, PayPal)
- [ ] Add CVV and expiry date validation
- [ ] Machine learning for fraud detection
- [ ] Webhook notifications for validation results
- [ ] Analytics dashboard for validation patterns
- [ ] GDPR-compliant data handling

---

## Contributing

While this is an assessment project, I welcome feedback and suggestions. For major changes, please open an issue first to discuss what you would like to change.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes following the existing code style
4. Add tests for your changes
5. Run the test suite (`npm test`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Commit Message Convention

This project uses conventional commit messages:

```text
feat: Add batch validation endpoint
fix: Handle empty card number gracefully
docs: Update README with API examples
test: Add test cases for validation service
refactor: Simplify Luhn algorithm implementation
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

### Diebere

- GitHub: [@fantuhmloop](https://github.com/fantuhmloop)
- Email: <mecdiebere@gmail.com>

---

## Acknowledgments

- [Luhn Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) - Wikipedia
- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Jest](https://jestjs.io/) - Testing framework

---

## API Status Dashboard

| Endpoint           | Method | Status         | Description              |
| ------------------ | ------ | -------------- | ------------------------ |
| `/health`          | GET    | 🟢 Operational | Service health check     |
| `/api/v1/validate` | POST   | 🟢 Operational | Card validation endpoint |

---

## Known Issues

- None currently reported. If you find any, please open an issue.

---

## Version History

| Version | Date       | Changes                    |
| ------- | ---------- | -------------------------- |
| 1.0.0   | 2026-09-03 | Initial release            |
|         |            | Basic Luhn validation      |
|         |            | Card type detection        |
|         |            | Rate limiting and security |
|         |            | Comprehensive test suite   |

---

## Changelog

### v1.0.0 (2026-09-03)

**Added:**

- Initial release with card validation API
- Luhn algorithm implementation
- Card type detection (Visa, Mastercard, Amex, Discover)
- Request validation middleware
- Rate limiting (100 requests/15 minutes)
- Security headers with Helmet.js
- Comprehensive error handling
- Unit and integration tests with Jest
- TypeScript strict mode support
- Health check endpoint
- Environment variable configuration
- Full README documentation

---

Built with ❤️ as a backend assessment project

---
