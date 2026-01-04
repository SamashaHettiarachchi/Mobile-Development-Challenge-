# FarmInvest Lite - Sri Lankan Farm Investment Tracker

A full-stack investment tracking application for Sri Lankan farmers, built with React Native (Expo) and Express.js + MySQL.

## Overview

FarmInvest Lite helps track agricultural investments with:

- **Sinhala language support** for farmer names
- **Sri Lankan Rupees (Rs.)** currency display
- **Local crops**: Rice, Tea, Coconut, Cinnamon, Coffee, etc.

## Project Structure

```
polygon/
├── backend/                    # Express.js API with MySQL
│   ├── index.js               # Main server (REST API)
│   ├── schema.sql             # Database schema
│   ├── seed.sql               # Sample data (10 Sinhala farmers)
│   ├── scripts/
│   │   ├── setup-db.js        # Database setup
│   │   └── seed-db.js         # Data seeding
│   ├── postman_collection.json
│   └── package.json
│
├── mobile/                     # React Native Expo app
│   ├── App.tsx                # Main application
│   ├── src/
│   │   ├── api.ts             # API client
│   │   ├── types.ts           # TypeScript types
│   │   ├── config.ts          # Configuration
│   │   └── components/
│   │       ├── InvestmentItem.tsx      # List item (Rs. display)
│   │       └── NewInvestmentModal.tsx  # Add investment form
│   ├── __tests__/
│   │   └── InvestmentItem.test.tsx
│   ├── index.js               # App entry point
│   └── package.json
│
└── README.md                   # This file
```

## Quick Start

### Prerequisites

- Node.js v20.18.1 (for Expo compatibility)
- MySQL 9.5
- Expo Go app (for mobile testing)

### Backend Setup

```bash
cd backend
npm install

# Configure database
# Edit .env file with your MySQL password

# Setup database
npm run db:setup
npm run db:seed

# Start server
npm start
# Server runs on http://localhost:3000
```

### Mobile App Setup

```bash
cd mobile
npm install

# Start Expo
npm start

# Options:
# - Press 'w' for web version
# - Scan QR code with Expo Go app
```

## Features

### Backend API

- ✅ **GET /api/investments** - Fetch all investments
- ✅ **POST /api/investments** - Create new investment
- ✅ **MySQL database** with parameterized queries
- ✅ **Input validation** and error handling
- ✅ **CORS enabled** for cross-origin requests

### Mobile App

- ✅ **List investments** with FlatList
- ✅ **Sinhala names** (සිරිල් පෙරේරා, කමලා විජේසිංහ, etc.)
- ✅ **Rs. currency format** (Rs. 50,000.00)
- ✅ **Pull-to-refresh**
- ✅ **Add new investment** via modal form
- ✅ **Optimistic UI updates** with rollback on error
- ✅ **Form validation** (client + server)
- ✅ **Error handling** with user feedback
- ✅ **TypeScript** for type safety
- ✅ **Unit tests** with Jest

## Technologies Used

### Backend

- Express.js 4.18.2
- MySQL2 3.6.5 (with connection pooling)
- CORS 2.8.5
- dotenv 16.3.1

### Mobile

- Expo 50.0.0
- React Native 0.73.2
- TypeScript 5.1.3
- React 18.2.0

### Testing

- Jest 29.7.0
- React Native Testing Library 12.4.3

## Database

### Schema

```sql
CREATE TABLE investments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  crop VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Data

- 10 Sri Lankan farmers with Sinhala names
- Investments in Rs. (32,000 - 100,000 range)
- Local crops: Rice, Tea, Coconut, Cinnamon, etc.

## Testing

### Backend API Testing

**Using cURL:**

```bash
# Get all investments
curl http://localhost:3000/api/investments

# Create new investment
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -d '{"farmer_name":"සමන් කුමාර","amount":85000,"crop":"Vegetables"}'
```

**Using Postman:**
Import `backend/postman_collection.json` for ready-to-use API tests.

### Mobile App Testing

```bash
cd mobile
npm test
```

## Running the App

### Web Version (Easiest)

1. Start backend: `cd backend && npm start`
2. Start Expo: `cd mobile && npm start`
3. Press **'w'** in the Expo terminal
4. App opens at http://localhost:8081

### Mobile Device

1. Install **Expo Go** from Play Store/App Store
2. Start Expo: `cd mobile && npm start`
3. Scan QR code with Expo Go
4. **Note**: If errors occur, clear Expo Go app data (Settings → Apps → Expo Go → Storage → Clear Data)

## Configuration

### Backend (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=farminvest_db
DB_PORT=3306
PORT=3000
```

### Mobile (src/config.ts)

```typescript
export const API_BASE_URL = "http://localhost:3000";
```

## Assignment Requirements

All requirements completed:

- ✅ Express backend with MySQL
- ✅ GET /api/investments endpoint
- ✅ POST /api/investments endpoint
- ✅ Parameterized SQL queries (SQL injection protection)
- ✅ Database schema with CHECK constraints
- ✅ 10+ sample investments seeded
- ✅ React Native mobile app with Expo
- ✅ TypeScript throughout
- ✅ FlatList component for investment list
- ✅ Add investment functionality
- ✅ Pull-to-refresh feature
- ✅ Optimistic UI updates
- ✅ Client and server validation
- ✅ Error handling with user feedback
- ✅ Unit tests with Jest
- ✅ Complete documentation

## Security Features

- Parameterized SQL queries prevent SQL injection
- Input validation on both client and server
- Environment variables for sensitive data
- CORS configuration for API access control

## API Endpoints

### GET /api/investments

Returns all investments with Sinhala names and Rs. amounts.

**Response:**

```json
[
  {
    "id": 1,
    "farmer_name": "සිරිල් පෙරේරා",
    "amount": "50000.00",
    "crop": "Rice",
    "created_at": "2026-01-04T09:41:04.000Z"
  }
]
```

### POST /api/investments

Creates a new investment.

**Request:**

```json
{
  "farmer_name": "කමලා විජේසිංහ",
  "amount": 32000,
  "crop": "Tea"
}
```

**Response:**

```json
{
  "id": 11,
  "farmer_name": "කමලා විජේසිංහ",
  "amount": 32000,
  "crop": "Tea"
}
```

## Troubleshooting

### Expo App Shows Errors

- Clear Expo Go app data: Settings → Apps → Expo Go → Storage → Clear Data
- Force stop and restart Expo Go
- Rescan QR code

### Backend Connection Issues

- Verify MySQL is running: `mysql -u root -p`
- Check .env file has correct DB_PASSWORD
- Ensure port 3000 is not in use

### Node Version Issues

- Expo SDK 50 requires Node v20 LTS
- Check version: `node --version`
- Should show v20.18.1

## License

MIT License - Free for educational and commercial use.

## Author

Built for Polygon Holdings Private Limited technical assessment.

**Time Taken**: ~3.5 hours
**Completion Date**: January 4, 2026
