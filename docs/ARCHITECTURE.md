# System Architecture

## Overview

MessMate follows a 3-tier architecture:

- Frontend (React)
- Backend (Node.js + Express)
- Database (MongoDB)

---

## Flow

1. User interacts with frontend
2. Frontend calls backend APIs
3. Backend processes logic
4. Data stored/retrieved from MongoDB
5. Response sent back to frontend

---

## Components

### Frontend
- React (Vite)
- Tailwind CSS
- QR Code Generator
- QR Scanner

### Backend
- Express.js
- JWT Authentication
- REST APIs

### Database
- MongoDB
- Collections:
  - Users
  - Events
  - Tokens

---

## Key Flow

Student → Generate Token → Backend → DB → QR  
Admin → Scan QR → Backend → Validate → Update Token