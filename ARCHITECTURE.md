# MONIVUE Finance Tracker - Architecture Overview

## 📋 Table of Contents
- [System Architecture](#system-architecture)
- [Frontend Layer](#frontend-layer)
- [Backend Layer](#backend-layer)
- [Data Models](#data-models)
- [Security Features](#security-features)
- [Key Features](#key-features)
- [Data Flow](#data-flow)
- [Deployment Configuration](#deployment-configuration)
- [Dependencies](#dependencies)

---

## 🏗️ System Architecture

MONIVUE Finance Tracker is a **full-stack MERN application** (MongoDB, Express, React, Node.js) with a **client-server architecture** following **RESTful API design patterns**.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                    │
│                   React Frontend (Port 3000)                 │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST API
┌───────────────────────────▼─────────────────────────────────┐
│                    API Layer (Express)                       │
│                   Node.js Server (Port 5000)                 │
│  Middleware: CORS, JWT Auth, Body Parser, DB Connection     │
└───────────────────────────┬─────────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼─────────────────────────────────┐
│                     Data Layer (MongoDB)                     │
│    Collections: Users, Transactions, Budgets, Goals, etc.   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Frontend Layer (React)

### Technology Stack
- **Framework:** React 19.1.1
- **Routing:** React Router DOM 7.8.2
- **State Management:** React Hooks (useState, useEffect, useCallback)
- **HTTP Client:** Axios 1.12.0
- **Charts:** Chart.js 4.5.0 + React-ChartJS-2 5.3.0
- **UI Libraries:** React Modal 3.16.3, React DatePicker 8.7.0
- **Export:** jsPDF 3.0.3, xlsx 0.18.5, html2canvas 1.4.1
- **Email:** EmailJS-com 3.2.0
- **Development Port:** 3000

### Component Structure

#### Core Components
```
src/
├── App.js                          # Main app component with routing
├── components/
│   ├── LaunchingPage.js            # Initial splash screen
│   ├── Register.js                 # User registration
│   ├── Login.js                    # User authentication
│   ├── Home.js                     # Main dashboard
│   ├── Transactions.js             # Transaction management
│   ├── TransactionModal.js         # Modal for adding transactions
│   ├── Budget.js                   # Budget creation & monitoring
│   ├── Goals.js                    # Financial goal tracking
│   ├── Reports.js                  # Analytics & reports
│   └── Chatbot.js                  # AI financial assistant
├── styles/                         # Component-specific CSS files
└── utils/
    ├── api.js                      # API utility functions
    ├── auth.js                     # Authentication helpers
    └── sendEmail.js                # Email functionality
```

#### Component Details

**1. LaunchingPage**
- Displays splash screen for 3.5 seconds
- Brand introduction

**2. Register/Login**
- User authentication with JWT
- Form validation
- Password confirmation
- Multi-currency support (30+ currencies)
- User profile data: name, email, age, job role, monthly salary

**3. Home Dashboard**
- Real-time financial statistics (income, expenses, balance)
- Recent transactions display
- Budget overview with progress bars
- Goal tracking summary
- Quick actions (Add Income/Expense)
- Profile management with dropdown
- Notification settings
- Profile editing with password change

**4. Transactions**
- CRUD operations for income/expense
- Filtering by date range, type, category
- Search functionality
- Recurring transaction support (daily/weekly/monthly/yearly)
- Category and subcategory selection
- Tag support
- Payment method tracking
- Transaction editing and deletion

**5. Budget**
- Create budgets (weekly/monthly/yearly)
- Multi-category budget allocation
- Real-time spent tracking
- Alert threshold configuration (default 80%)
- Visual progress indicators
- Budget period management
- Category-wise breakdown

**6. Goals**
- Financial goal creation
- Target amount and date
- Priority levels (low/medium/high)
- Categories: emergency fund, vacation, car, house, education, investment, debt payoff, other
- Progress tracking with percentage
- Monthly contribution calculation
- Status management (active/completed/paused/cancelled)

**7. Reports**
- Visual analytics with Chart.js
- Date range filtering
- Income vs Expense charts
- Category-wise spending breakdown
- Trend analysis
- Export to PDF (jsPDF)
- Export to Excel (xlsx)
- Screenshot capability (html2canvas)

**8. Chatbot**
- Fixed position floating chat button
- Rule-based AI responses
- Financial advice topics:
  - Saving strategies
  - Budgeting techniques
  - Investment basics
  - Debt management
  - Tax planning
  - Expense optimization
- Feature help and troubleshooting
- Context-aware responses

### Authentication Flow
1. User submits login credentials
2. Backend validates and returns JWT token
3. Token stored in `localStorage` with key `token`
4. User data stored in `localStorage` with key `user`
5. Protected routes check `isAuthenticated()` utility
6. API calls include `Authorization: Bearer <token>` header
7. Token invalid/expired → redirect to login
8. Custom event `authChange` triggers re-authentication check

### State Management
- **Local Component State:** useState for component-specific data
- **Side Effects:** useEffect for API calls, timers, event listeners
- **Callbacks:** useCallback for optimized re-renders
- **localStorage:** Persistent auth state across sessions

---

## ⚙️ Backend Layer (Node.js + Express)

### Technology Stack
- **Runtime:** Node.js
- **Framework:** Express 4.18.2
- **Database:** MongoDB with Mongoose 7.5.0
- **Authentication:** jsonwebtoken 9.0.2 + bcryptjs 2.4.3
- **Email Service:** Nodemailer 7.0.9 (Mailtrap SMTP)
- **Scheduling:** node-cron 4.2.1
- **Export Libraries:** ExcelJS 4.4.0, PDFKit 0.17.2, Puppeteer 24.25.0
- **Development Port:** 5000

### Server Architecture

#### Middleware Stack (Execution Order)
1. **CORS Middleware**
   ```javascript
   cors({
     origin: ['http://localhost:3000', 'http://localhost:3001'],
     credentials: true
   })
   ```

2. **Body Parser**
   - JSON parsing (10MB limit)
   - URL-encoded data parsing

3. **Request Logger**
   - Logs all HTTP requests: `METHOD PATH`

4. **Database Connection Guard**
   - Checks MongoDB connection state
   - Blocks requests if DB disconnected (state !== 1)
   - Returns 503 status with error details
   - Allows `/health` endpoint to bypass check

5. **JWT Authentication Middleware** (Route-specific)
   - Extracts `Authorization: Bearer <token>` header
   - Verifies token with JWT_SECRET
   - Attaches decoded user to `req.user`
   - Returns 401 if invalid/missing

### API Routes

#### 1. Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration | No |
| POST | `/login` | User login | No |
| PUT | `/profile` | Update user profile | Yes |

#### 2. Transaction Routes (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all user transactions | Yes |
| POST | `/` | Create new transaction | Yes |
| GET | `/:id` | Get single transaction | Yes |
| PUT | `/:id` | Update transaction | Yes |
| DELETE | `/:id` | Delete transaction | Yes |

#### 3. Budget Routes (`/api/budgets`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all user budgets | Yes |
| POST | `/` | Create new budget | Yes |
| GET | `/:id` | Get single budget | Yes |
| PUT | `/:id` | Update budget | Yes |
| DELETE | `/:id` | Delete budget | Yes |
| GET | `/:id/status` | Get budget status | Yes |

#### 4. Goal Routes (`/api/goals`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all user goals | Yes |
| POST | `/` | Create new goal | Yes |
| GET | `/:id` | Get single goal | Yes |
| PUT | `/:id` | Update goal | Yes |
| DELETE | `/:id` | Delete goal | Yes |
| POST | `/:id/contribute` | Add contribution | Yes |

#### 5. Category Routes (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all categories | Yes |
| POST | `/` | Create new category | Yes |
| PUT | `/:id` | Update category | Yes |
| DELETE | `/:id` | Delete category | Yes |

#### 6. Report Routes (`/api/reports`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/summary` | Get financial summary | Yes |
| POST | `/export/pdf` | Export report as PDF | Yes |
| POST | `/export/excel` | Export report as Excel | Yes |

#### 7. Notification Routes (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/settings` | Get notification settings | Yes |
| PUT | `/settings` | Update notification settings | Yes |
| POST | `/test` | Send test notification | Yes |

#### 8. Chatbot Routes (`/api/chatbot`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/message` | Send message to chatbot | Yes |

#### 9. Health Check (`/health`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Server health status | No |

### Controllers

#### authController.js
**Responsibilities:**
- User registration with password hashing (bcrypt, 10 salt rounds)
- User login with credential validation
- JWT token generation (includes: userId, email, name)
- Profile updates (name, email, salary, currency, password)
- Email uniqueness validation
- Current password verification for updates

**Key Functions:**
- `register(req, res)` - Creates new user account
- `login(req, res)` - Authenticates user, returns JWT
- `updateProfile(req, res)` - Updates user information

#### transactionController.js
**Responsibilities:**
- CRUD operations for transactions
- Transaction filtering (date range, type, category)
- Recurring transaction management
- Budget integration (updates budget spent amounts)
- Transaction statistics calculation

#### budgetController.js
**Responsibilities:**
- Budget creation and management
- Multi-category budget allocation
- Spent amount tracking from transactions
- Alert generation when threshold exceeded
- Budget period calculation (start/end dates)
- Budget status reports

#### goalController.js
**Responsibilities:**
- Financial goal management
- Progress tracking
- Monthly contribution calculations
- Goal completion detection
- Priority and status management
- Contribution history

#### categoryController.js
**Responsibilities:**
- Category and subcategory management
- Icon and color assignments
- Type management (income/expense/both)
- Unique category names enforcement

#### chatbotController.js
**Responsibilities:**
- Rule-based pattern matching
- Financial advice generation
- Feature help responses
- Troubleshooting guidance
- Context-aware responses for:
  - Saving strategies
  - Budgeting techniques
  - Salary management
  - Investment basics
  - Debt management
  - Tax planning
  - Goal setting
  - Expense management
  - Error troubleshooting

### Services

#### emailService.js
**Capabilities:**
- Nodemailer transporter configuration (Mailtrap SMTP)
- HTML email template generation
- Financial summary emails with:
  - Transaction summaries (income/expense breakdown)
  - Budget alerts (categories exceeding thresholds)
  - Goal progress updates
  - Salary-based financial tips
- Styled email templates with responsive design
- Error handling and logging

**Email Configuration:**
```javascript
{
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
}
```

#### schedulerService.js
**Cron Jobs:**
1. **Daily Notifications** - `0 9 * * *` (Every day at 9:00 AM)
2. **Weekly Notifications** - `0 9 * * 1` (Every Monday at 9:00 AM)
3. **Monthly Notifications** - `0 9 1 * *` (1st of every month at 9:00 AM)

**Functionality:**
- Fetches users with enabled notifications for specific frequency
- Aggregates user financial data:
  - Recent transactions
  - Budget status
  - Goal progress
- Sends personalized email summaries
- Includes salary-based financial tips (optional)
- Error handling per user (continues if one fails)

### Database Connection
**MongoDB Connection Features:**
- Retry logic (5 attempts, 3-second delays)
- Connection state monitoring
- Buffering disabled for immediate errors
- Timeouts: 10s server selection, 45s socket
- Detailed error logging
- DNS resolution error detection
- Helpful error messages for Atlas/local setup

---

## 💾 Data Models (MongoDB/Mongoose)

### 1. User Model
**File:** `BACKEND/models/User.js`

**Schema:**
```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, trimmed),
  age: Number (required),
  jobRole: String (required),
  monthlySalary: Number (required),
  currency: String (default: 'USD', enum: 30+ currencies),
  password: String (required, hashed),
  notificationSettings: {
    enabled: Boolean (default: false),
    email: String (default: ''),
    frequency: String (enum: ['daily', 'weekly', 'monthly'], default: 'weekly'),
    includeSalaryTips: Boolean (default: true),
    includeGoals: Boolean (default: true),
    includeBudgets: Boolean (default: true)
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Supported Currencies:**
USD, EUR, GBP, JPY, CNY, INR, CAD, AUD, CHF, MXN, BRL, ZAR, SGD, HKD, KRW, SEK, NOK, DKK, PLN, THB, MYR, IDR, PHP, TRY, RUB, AED, SAR, EGP, NGN, KES, LKR

### 2. Transaction Model
**File:** `BACKEND/models/Transaction.js`

**Schema:**
```javascript
{
  userId: ObjectId (ref: 'User', required, indexed),
  type: String (enum: ['income', 'expense'], required),
  amount: Number (required, min: 0),
  category: String (required),
  subcategory: String (default: ''),
  description: String (required),
  date: Date (default: Date.now, indexed),
  recurring: {
    isRecurring: Boolean (default: false),
    frequency: String (enum: ['daily', 'weekly', 'monthly', 'yearly'], default: 'monthly'),
    nextDate: Date
  },
  tags: [String],
  paymentMethod: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `userId` (for user-specific queries)
- `date` (for date range filtering)
- Compound: `userId + date` (optimized queries)

### 3. Budget Model
**File:** `BACKEND/models/Budget.js`

**Schema:**
```javascript
{
  userId: ObjectId (ref: 'User', required),
  name: String (required),
  period: String (enum: ['weekly', 'monthly', 'yearly'], default: 'monthly'),
  startDate: Date (required),
  endDate: Date (required),
  categories: [{
    category: String (required),
    budgetedAmount: Number (required, min: 0),
    spentAmount: Number (default: 0, min: 0),
    alertThreshold: Number (default: 80, min: 0, max: 100)
  }],
  totalBudget: Number (required, min: 0),
  totalSpent: Number (default: 0, min: 0),
  alerts: [{
    category: String,
    message: String,
    date: Date,
    acknowledged: Boolean (default: false)
  }],
  status: String (enum: ['active', 'completed', 'exceeded'], default: 'active'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Business Logic:**
- Auto-calculates `spentAmount` from transactions
- Generates alerts when `spentAmount` exceeds `alertThreshold`
- Updates `totalSpent` as sum of category spent amounts
- Marks budget as `exceeded` when totalSpent > totalBudget

### 4. Goal Model
**File:** `BACKEND/models/Goal.js`

**Schema:**
```javascript
{
  userId: ObjectId (ref: 'User', required),
  name: String (required),
  description: String (default: ''),
  targetAmount: Number (required, min: 0),
  currentAmount: Number (default: 0, min: 0),
  category: String (
    enum: ['emergency_fund', 'vacation', 'car', 'house', 
           'education', 'investment', 'debt_payoff', 'other'],
    default: 'other'
  ),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  targetDate: Date (required),
  status: String (
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  ),
  monthlyContribution: Number (default: 0, min: 0),
  contributions: [{
    amount: Number,
    date: Date,
    note: String
  }],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Calculated Fields:**
- Progress percentage: `(currentAmount / targetAmount) * 100`
- Months remaining: Time between now and targetDate
- Required monthly: `(targetAmount - currentAmount) / monthsRemaining`

### 5. Category Model
**File:** `BACKEND/models/Category.js`

**Schema:**
```javascript
{
  name: String (required, unique),
  type: String (enum: ['income', 'expense', 'both'], default: 'expense'),
  icon: String (default: '📁'),
  color: String (default: '#64b5f6'),
  subcategories: [{
    name: String (required),
    icon: String (default: '📄')
  }],
  isDefault: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Default Categories:**
System includes pre-seeded categories for common expenses/income types.

---

## 🔐 Security Features

### 1. Password Security
- **Hashing Algorithm:** bcryptjs with 10 salt rounds
- **Storage:** Only hashed passwords stored in database
- **Validation:** Minimum length requirements (client-side)
- **Confirmation:** Password confirmation field on registration

### 2. Authentication & Authorization
- **JWT Tokens:** Stateless authentication
- **Token Composition:** userId, email, name
- **Token Location:** HTTP Authorization header (`Bearer <token>`)
- **Token Expiration:** Configurable via JWT_SECRET env
- **Protected Routes:** Middleware validates token on every request
- **Client Storage:** localStorage (token + user data)

### 3. API Security
- **CORS:** Restricted to localhost:3000/3001 origins
- **Credentials:** CORS credentials enabled
- **Input Validation:** Required field checks in controllers
- **Error Handling:** Generic error messages (no sensitive data leakage)
- **Database Connection Guard:** Prevents requests when DB disconnected
- **HTTP Status Codes:** Proper use (200, 201, 400, 401, 403, 500, 503)

### 4. Data Validation
- **Schema Validation:** Mongoose schema constraints
- **Enum Restrictions:** Limited values for type fields
- **Min/Max Constraints:** Numeric field limits
- **Unique Constraints:** Email uniqueness enforcement
- **Required Fields:** Database-level requirements
- **Trim/Transform:** Auto-trimming whitespace

### 5. Best Practices
- **Environment Variables:** Sensitive data in .env (not in repo)
- **Error Logging:** Console logging for debugging (no sensitive data)
- **Connection Retry:** Graceful MongoDB reconnection
- **Request Timeout:** Socket timeout to prevent hanging requests
- **Body Size Limit:** 10MB max to prevent DoS
- **Unique Indexes:** Performance and data integrity

---

## 📊 Key Features

### 1. Transaction Management
**Capabilities:**
- ✅ Add income/expense transactions
- ✅ Category and subcategory organization
- ✅ Tag support for flexible organization
- ✅ Recurring transactions (daily/weekly/monthly/yearly)
- ✅ Payment method tracking
- ✅ Date-based filtering
- ✅ Search functionality
- ✅ Edit and delete operations
- ✅ Transaction history

**Use Cases:**
- Track daily expenses (coffee, lunch, transportation)
- Record monthly income (salary, freelance)
- Monitor recurring bills (rent, subscriptions)
- Organize with categories and tags

### 2. Budget Tracking
**Capabilities:**
- ✅ Multi-category budget creation
- ✅ Period-based budgets (weekly/monthly/yearly)
- ✅ Real-time spent amount tracking
- ✅ Customizable alert thresholds (default 80%)
- ✅ Visual progress indicators
- ✅ Budget vs actual comparison
- ✅ Alert notifications
- ✅ Historical budget data

**Use Cases:**
- Set monthly spending limits per category
- Monitor grocery budget weekly
- Track vacation savings monthly
- Get alerts when approaching limits

### 3. Financial Goals
**Capabilities:**
- ✅ Target amount and date setting
- ✅ Priority levels (low/medium/high)
- ✅ Progress tracking with percentage
- ✅ Multiple goal categories
- ✅ Monthly contribution planning
- ✅ Contribution history
- ✅ Goal status management (active/completed/paused)
- ✅ Visual progress indicators

**Goal Categories:**
- Emergency Fund
- Vacation
- Car Purchase
- House Down Payment
- Education
- Investment
- Debt Payoff
- Other

### 4. Reports & Analytics
**Capabilities:**
- ✅ Visual charts (pie, bar, line)
- ✅ Income vs expense trends
- ✅ Category-wise spending analysis
- ✅ Date range filtering
- ✅ Monthly/yearly comparisons
- ✅ Export to PDF
- ✅ Export to Excel
- ✅ Screenshot capture
- ✅ Custom report generation

**Chart Types:**
- Pie Chart: Category distribution
- Bar Chart: Monthly comparison
- Line Chart: Trend analysis

### 5. AI Financial Chatbot
**Capabilities:**
- ✅ Rule-based financial advice
- ✅ Context-aware responses
- ✅ Feature help and guidance
- ✅ Troubleshooting assistance
- ✅ Always accessible (fixed position)

**Topics Covered:**
- Saving strategies (50/30/20 rule, emergency fund)
- Budgeting techniques
- Salary management
- Investment basics
- Debt management (avalanche/snowball methods)
- Tax planning
- Goal setting (SMART goals)
- Expense optimization
- Feature usage help

### 6. Email Notifications
**Capabilities:**
- ✅ Scheduled summaries (daily/weekly/monthly)
- ✅ HTML formatted emails
- ✅ Transaction summaries
- ✅ Budget alerts
- ✅ Goal progress updates
- ✅ Salary-based financial tips
- ✅ Customizable frequency
- ✅ Optional content (tips, goals, budgets)

**Email Content:**
- Period summary (income, expenses, balance)
- Recent transactions list
- Budget status by category
- Goal progress indicators
- Personalized financial tips
- Action items

### 7. Multi-Currency Support
**Supported:** 30+ global currencies
- USD, EUR, GBP, JPY, CNY, INR, CAD, AUD
- CHF, MXN, BRL, ZAR, SGD, HKD, KRW, SEK
- NOK, DKK, PLN, THB, MYR, IDR, PHP, TRY
- RUB, AED, SAR, EGP, NGN, KES, LKR

**Features:**
- User selects currency on registration
- All financial displays use user's currency
- Currency stored in user profile

### 8. User Profile Management
**Capabilities:**
- ✅ Update name, email
- ✅ Update monthly salary
- ✅ Change currency
- ✅ Password change with verification
- ✅ Notification settings management
- ✅ Profile dropdown with quick actions

---

## 🔄 Data Flow

### Standard Request-Response Cycle

```
┌──────────────┐
│   User       │
│   Action     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│  React Component         │
│  (e.g., Transactions.js) │
└──────────┬───────────────┘
           │
           │ 1. Event Trigger (onClick, onSubmit)
           ▼
┌──────────────────────────┐
│  API Utility (api.js)    │
│  + Auth Token            │
└──────────┬───────────────┘
           │
           │ 2. HTTP Request (Axios)
           │    Headers: { Authorization: Bearer <JWT> }
           ▼
┌──────────────────────────┐
│  Express Server          │
│  app.js / server.js      │
└──────────┬───────────────┘
           │
           │ 3. Middleware Chain
           ▼
┌──────────────────────────┐     ┌──────────────────┐
│  CORS Middleware         │────▶│  Body Parser     │
└──────────────────────────┘     └────────┬─────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │ Request Logger   │
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │ DB Guard Check   │
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │ Route Handler    │
                                  │ (e.g., /api/...)  │
                                  └────────┬─────────┘
                                           │
           │ 4. JWT Authentication (if protected)
           ▼
┌──────────────────────────┐
│  Auth Middleware         │
│  Verify JWT Token        │
└──────────┬───────────────┘
           │
           │ 5. Route to Controller
           ▼
┌──────────────────────────┐
│  Controller Function     │
│  (e.g., createTransaction)│
└──────────┬───────────────┘
           │
           │ 6. Business Logic
           ▼
┌──────────────────────────┐
│  Mongoose Model          │
│  (e.g., Transaction)     │
└──────────┬───────────────┘
           │
           │ 7. Database Query
           ▼
┌──────────────────────────┐
│  MongoDB Database        │
│  CRUD Operation          │
└──────────┬───────────────┘
           │
           │ 8. Return Data
           ▼
┌──────────────────────────┐
│  Controller Response     │
│  res.json({ data })      │
└──────────┬───────────────┘
           │
           │ 9. HTTP Response
           ▼
┌──────────────────────────┐
│  React Component         │
│  Update State            │
└──────────┬───────────────┘
           │
           │ 10. Re-render UI
           ▼
┌──────────────────────────┐
│  Updated UI Display      │
└──────────────────────────┘
```

### Example: Creating a Transaction

**Frontend (Transactions.js):**
```javascript
const handleAddTransaction = async (transactionData) => {
  try {
    const response = await createTransaction(transactionData);
    // Update state, close modal, refresh list
  } catch (error) {
    // Handle error
  }
};
```

**API Utility (api.js):**
```javascript
export const createTransaction = async (transactionData) => {
  return apiCall('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
};

const apiCall = async (endpoint, options) => {
  const token = getAuthToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    ...options
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return await response.json();
};
```

**Backend Route (routes/transactions.js):**
```javascript
router.post('/', authMiddleware, transactionController.create);
```

**Controller (transactionController.js):**
```javascript
exports.create = async (req, res) => {
  const { type, amount, category, description, date } = req.body;
  const userId = req.user.userId;
  
  const transaction = new Transaction({
    userId, type, amount, category, description, date
  });
  
  await transaction.save();
  
  // Update related budget if exists
  await updateBudgetSpending(userId, category, amount, type);
  
  res.status(201).json({ transaction });
};
```

**Database Operation:**
```javascript
// Mongoose saves document to MongoDB
// Updates budget spent amounts
// Returns saved document
```

**Response Back to Frontend:**
```javascript
// Success response triggers:
// 1. State update (add transaction to list)
// 2. Close modal
// 3. Refresh statistics
// 4. Show success message
```

---

## 🚀 Deployment Configuration

### Backend Configuration

**Entry Point:** `BACKEND/server.js`

**Environment Variables (.env):**
```bash
# Database
MONGO_URI=mongodb://localhost:27017/finance_tracker
# OR
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finance_tracker

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Email Service (Mailtrap)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASSWORD=your_mailtrap_password

# Server
PORT=5000
NODE_ENV=development
```

**Scripts:**
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

**MongoDB Connection:**
- Retry logic: 5 attempts with 3-second delays
- Connection options:
  - `serverSelectionTimeoutMS`: 10000
  - `socketTimeoutMS`: 45000
  - `bufferCommands`: false
- Auto-initializes scheduler on successful connection
- Detailed error messages for troubleshooting

**Production Considerations:**
- Set `NODE_ENV=production`
- Use MongoDB Atlas for cloud database
- Configure proper JWT_SECRET (long, random)
- Set up production email service (SendGrid, AWS SES)
- Enable HTTPS
- Configure proper CORS origins
- Add rate limiting middleware
- Implement request validation
- Add monitoring and logging (Winston, Morgan)

### Frontend Configuration

**Build Output:** `frontend/build/`

**Environment Configuration:**
```javascript
// frontend/src/utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

**Scripts:**
```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

**Development:** `npm start` (Port 3000)
**Production Build:** `npm run build`

**Production Deployment:**
- Build static files: `npm run build`
- Deploy to:
  - **Vercel:** Connect GitHub repo, auto-deploy
  - **Netlify:** Drag & drop build folder or CLI
  - **AWS S3 + CloudFront:** Static hosting
  - **Heroku:** With Node.js buildpack
- Set environment variables in deployment platform
- Configure API_BASE_URL to production backend URL
- Enable HTTPS
- Set up CI/CD pipeline

### Deployment Options

#### Option 1: Separate Deployment
- **Frontend:** Vercel/Netlify (static hosting)
- **Backend:** Heroku/Railway/DigitalOcean (Node.js hosting)
- **Database:** MongoDB Atlas (cloud)
- **Pros:** Scalable, specialized services
- **Cons:** CORS configuration needed

#### Option 2: Single Server
- **Server:** Express serves React build folder
- **Database:** MongoDB Atlas or local
- **Pros:** Simpler deployment, no CORS issues
- **Cons:** Less scalable

**Single Server Setup:**
```javascript
// server.js
const path = require('path');

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}
```

---

## 📦 Dependencies

### Backend Dependencies

**Core:**
```json
{
  "express": "^4.18.2",           // Web framework
  "mongoose": "^7.5.0",           // MongoDB ODM
  "dotenv": "^16.3.1",            // Environment variables
  "cors": "^2.8.5"                // CORS middleware
}
```

**Authentication:**
```json
{
  "jsonwebtoken": "^9.0.2",       // JWT tokens
  "bcryptjs": "^2.4.3"            // Password hashing
}
```

**Email & Scheduling:**
```json
{
  "nodemailer": "^7.0.9",         // Email sending
  "node-cron": "^4.2.1"           // Scheduled tasks
}
```

**Data Export:**
```json
{
  "exceljs": "^4.4.0",            // Excel generation
  "pdfkit": "^0.17.2",            // PDF generation
  "puppeteer": "^24.25.0"         // PDF from HTML
}
```

**Utilities:**
```json
{
  "axios": "^1.12.0"              // HTTP client
}
```

**Development:**
```json
{
  "nodemon": "^3.0.1"             // Auto-restart server
}
```

### Frontend Dependencies

**Core:**
```json
{
  "react": "^19.1.1",             // UI library
  "react-dom": "^19.1.1",         // React DOM
  "react-router-dom": "^7.8.2",   // Routing
  "react-scripts": "5.0.1"        // Build tools
}
```

**HTTP & State:**
```json
{
  "axios": "^1.12.0"              // HTTP requests
}
```

**UI Components:**
```json
{
  "react-modal": "^3.16.3",       // Modal dialogs
  "react-datepicker": "^8.7.0"    // Date picker
}
```

**Charts & Visualization:**
```json
{
  "chart.js": "^4.5.0",           // Chart library
  "react-chartjs-2": "^5.3.0"     // React wrapper
}
```

**Export & Print:**
```json
{
  "jspdf": "^3.0.3",              // PDF generation
  "xlsx": "^0.18.5",              // Excel export
  "html2canvas": "^1.4.1"         // Screenshot
}
```

**Email:**
```json
{
  "emailjs-com": "^3.2.0"         // Client email
}
```

**Testing:**
```json
{
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.8.0",
  "@testing-library/user-event": "^13.5.0",
  "@testing-library/dom": "^10.4.1"
}
```

**Utilities:**
```json
{
  "web-vitals": "^2.1.4"          // Performance metrics
}
```

---

## 🎯 Design Patterns Used

### 1. MVC (Model-View-Controller)
- **Model:** Mongoose schemas (User, Transaction, Budget, Goal, Category)
- **View:** React components (UI layer)
- **Controller:** Express controllers (business logic)

### 2. Repository Pattern
- Mongoose models abstract database operations
- Controllers use models for data access
- Clean separation of data layer

### 3. Middleware Pattern
- Express middleware chain
- Reusable authentication middleware
- Request/response processing pipeline

### 4. Service Layer Pattern
- Email service abstracts Nodemailer
- Scheduler service handles cron jobs
- Business logic separated from controllers

### 5. API Gateway Pattern
- Single Express server as API gateway
- Routes organized by resource
- Centralized authentication

### 6. JWT Token-Based Authentication
- Stateless authentication
- Token stored client-side
- Verified on each request

---

## 🔍 Code Organization Best Practices

### Backend Structure
```
BACKEND/
├── server.js                 # Entry point, server config
├── package.json              # Dependencies
├── .env                      # Environment variables (gitignored)
├── controllers/              # Business logic
│   ├── authController.js
│   ├── transactionController.js
│   └── ...
├── models/                   # Mongoose schemas
│   ├── User.js
│   ├── Transaction.js
│   └── ...
├── routes/                   # API endpoints
│   ├── auth.js
│   ├── transactions.js
│   └── ...
└── services/                 # Third-party integrations
    ├── emailService.js
    └── schedulerService.js
```

### Frontend Structure
```
frontend/
├── public/                   # Static assets
├── src/
│   ├── App.js               # Main component with routing
│   ├── index.js             # React entry point
│   ├── components/          # React components
│   │   ├── Home.js
│   │   ├── Transactions.js
│   │   └── styles/          # Component CSS
│   ├── utils/               # Utility functions
│   │   ├── api.js           # API calls
│   │   └── auth.js          # Auth helpers
│   └── styles/              # Global styles
└── package.json
```

---

## 📈 Future Enhancements

### Potential Features
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, Facebook)
- [ ] Real-time notifications (WebSockets)
- [ ] Mobile app (React Native)
- [ ] Bank account integration (Plaid API)
- [ ] Advanced analytics (ML predictions)
- [ ] Shared budgets (family accounts)
- [ ] Receipt scanning (OCR)
- [ ] Investment tracking
- [ ] Cryptocurrency support
- [ ] Dark mode
- [ ] Multi-language support (i18n)
- [ ] Automated categorization (ML)
- [ ] Bill reminders
- [ ] Financial news integration

### Technical Improvements
- [ ] Add comprehensive test suite (Jest, Mocha)
- [ ] Implement GraphQL API option
- [ ] Add Redis caching layer
- [ ] Implement rate limiting
- [ ] Add request validation (Joi, Yup)
- [ ] Improve error handling
- [ ] Add API documentation (Swagger)
- [ ] Implement CI/CD pipeline
- [ ] Add monitoring (Sentry, LogRocket)
- [ ] Optimize database queries (indexing)
- [ ] Add database seeding scripts
- [ ] Implement data backup strategy

---

## 📝 License

This project is part of a finance tracker application developed as a final project.

---

## 👥 Support

For issues, questions, or contributions, please refer to the project repository.

---

**Last Updated:** February 6, 2026
**Version:** 1.0.0
**Architecture Type:** Monolithic MERN Stack with Microservices patterns
