# MorningWood Studio - Full Stack Setup Guide

This repository contains a full stack project with:
- Django backend API
- React frontend (Create React App)
- SQLite database (local development)

This README explains exactly how to run the project locally from scratch.

## 1. Project Structure

- backend: Django API project
- frontend: React client app
- requirements.txt: Python dependencies for the backend

## 2. Prerequisites

Install these first:

- Python 3.11+ (3.12 works)
- Node.js 18+ and npm
- Git

Optional but recommended:

- VS Code
- Postman (for API testing)

## 3. Environment Variables (Backend)

Create a file at:

backend/.env

Add the following values:

SECRET_KEY=your_django_secret_key_here
DEBUG=True
PAYPAL_RECEIVER=your_paypal_email@example.com
PAYPAL_TEST=True

Notes:
- DEBUG=True is for local development only.
- PAYPAL_TEST=True enables sandbox behavior in your current code flow.
- If SECRET_KEY is missing, Django will fail to start.

## 4. Backend Setup (Django)

Open a terminal in the project root, then run:

1. Go to backend folder
- cd backend

2. Create virtual environment
- py -m venv .venv

3. Activate virtual environment (PowerShell)
- .\.venv\Scripts\Activate.ps1

4. Install dependencies
- pip install -r ..\requirements.txt

5. Apply migrations
- py manage.py migrate

6. Create admin account (optional but recommended)
- py manage.py createsuperuser

7. Run backend server
- py manage.py runserver

Backend URL:
- http://localhost:8000

## 5. Frontend Setup (React)

Open another terminal in the project root, then run:

1. Go to frontend folder
- cd frontend
- Update PayPal Client ID in src/components/PayPalCheckout.js (line 44)

2. Install dependencies
- npm install

3. Run development server
- npm start

Frontend URL:
- http://localhost:3000

## 6. Run Order

Always start backend first, then frontend.

- Terminal 1: backend server at port 8000
- Terminal 2: frontend server at port 3000

If backend is not running, frontend API calls will fail.

## 7. API Base Routes (Current)

Your backend currently uses versioned routes:

- Base API prefix: /api/v1/
- Users routes: /api/v1/users/
- Applications routes: /api/v1/applications/

Key endpoints currently used by frontend:

Authentication and profile:
- POST /api/v1/users/login/
- POST /api/v1/users/register/
- GET /api/v1/users/profile/

Admin users:
- GET /api/v1/users/admin/users/
- PUT /api/v1/users/admin/users/<user_id>/
- DELETE /api/v1/users/admin/users/<user_id>/

Seller applications lifecycle:
- POST /api/v1/applications/apply/
- GET /api/v1/applications/list/
- POST /api/v1/applications/<pk>/approve/
- POST /api/v1/applications/<pk>/decline/

Payment:
- POST /api/v1/create/

## 8. JWT Authentication Notes

The backend uses JWT auth (SimpleJWT).

- Login returns access and refresh tokens.
- Frontend stores tokens in local storage.
- Protected endpoints require Authorization: Bearer <access_token>.

If protected requests fail with 401:
- Sign in again to refresh stored credentials.
- Check browser local storage for token keys.

## 9. Common Commands

Backend:
- py manage.py check
- py manage.py migrate
- py manage.py runserver

Frontend:
- npm start
- npm run build
- npm test

## 10. Troubleshooting

1. Error: Payment endpoint not found
- Verify backend is running on http://localhost:8000
- Verify frontend calls /api/v1/create/

2. Error: CORS issue
- Confirm frontend runs on http://localhost:3000
- Confirm backend CORS_ALLOWED_ORIGINS includes localhost:3000

3. Error: SECRET_KEY missing
- Add SECRET_KEY in backend/.env

4. Error: Module not found (frontend)
- Run npm install again in frontend

5. Error: Django import/dependency issue
- Ensure virtual environment is activated
- Re-run pip install -r ..\requirements.txt

6. Error: JWT protected endpoint returns 403/401
- Check user role (admin endpoints require admin)
- Sign in again to refresh token and stored user

## 11. Build for Production (Frontend)

From frontend folder:
- npm run build

Output is generated in:
- frontend/build

## 12. Existing Frontend README

The default CRA README remains at:
- frontend/README.md

Use this root README as the main project run guide.
