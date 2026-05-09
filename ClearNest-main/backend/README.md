# ClearNest - Transparent Society Management Portal

A professional Flask backend built with transparency and scalability in mind.

## Tech Stack
- **Framework:** Flask
- **Database:** MongoDB (Flask-PyMongo)
- **Authentication:** JWT (Flask-JWT-Extended) & Bcrypt
- **Storage:** Firebase Storage (Media & Docs only)
- **Payments:** Razorpay
- **Environment:** python-dotenv

## Project Structure
```text
backend/
├── app/
│   ├── routes/          # API Route definitions
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & Role-based middleware
│   ├── services/        # Third-party service integrations
│   ├── validators/      # Request validation logic
│   ├── config/          # App configuration
│   ├── database/        # DB connection helpers
│   ├── firebase/        # Firebase initialization & services
│   ├── utils/           # Shared utilities
│   └── __init__.py      # App factory
├── uploads/             # Local temp storage
├── venv/                # Virtual environment
├── app.py               # Entry point
├── requirements.txt     # Dependencies
└── .env                 # Environment secrets
```

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configuration
Create a `.env` file from `.env.example` and fill in your credentials:
- MongoDB URI
- Razorpay Keys
- Firebase Storage Bucket & Credentials Path

### 5. Firebase Setup
Place your `firebase-credentials.json` in `backend/app/firebase/` or update the path in `.env`.

### 6. Run Application
```bash
python app.py
```
The server will start at `http://localhost:5000`.

## API Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Something went wrong"
}
```
