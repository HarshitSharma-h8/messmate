# 📌 Project Title
## MessMate – Smart Mess Entry Management System

---

# 📌 Problem Statement

In traditional mess systems, entry management is inefficient and error-prone:

- ❌ Manual verification leads to long queues  
- ❌ Duplicate or unauthorized entries are hard to prevent  
- ❌ No real-time tracking of entries  
- ❌ No control over time-based access (slots)  
- ❌ Difficult for admins to monitor usage  

---

# 📌 Solution

MessMate is a digital token-based entry system that:

- ✅ Allows admins to create time-based events (mess slots)  
- ✅ Enables students to generate a unique QR-based token  
- ✅ Uses QR scanning for fast and secure entry verification  
- ✅ Prevents duplicate or invalid entries  
- ✅ Provides real-time monitoring of entries and stats  

---

# 📌 Objectives

- 🎯 Eliminate manual entry verification  
- 🎯 Ensure secure and unique access per student  
- 🎯 Enable fast QR-based gate entry  
- 🎯 Provide real-time analytics to admins  
- 🎯 Support scalable event-based entry system  

---

# 📌 User Roles

## 👨‍🎓 Student
- Register and verify account (OTP)  
- Login to dashboard  
- View active event  
- Generate entry token  
- Show QR code at gate  

## 🧑‍💼 Admin
- Login to admin panel  
- Create events with time slots  
- Scan student QR at entry  
- Verify tokens  
- View live entries  
- Monitor event statistics  

---

# 📌 Key Features

## 🔐 Authentication
- Register with OTP verification  
- Login / Logout  
- Forgot & Reset Password  

## 🎟️ Token System
- One token per student per event  
- QR-based token generation  
- Token status:
  - UNUSED  
  - USED  
  - EXPIRED  

## 📅 Event Management
Admin creates event with:
- Start time  
- End time  
- Degree/semester slots  

## 📷 QR-Based Entry
- Scan QR using camera  
- Instant verification  
- Prevent reuse of token  

## 📊 Admin Dashboard
- Total tokens  
- Used / Unused / Expired  
- Live entry feed  

---

# 📌 Tech Stack

## Frontend
- React (Vite)  
- Tailwind CSS  
- QR Code (qrcode.react)  
- QR Scanner (html5-qrcode)  

## Backend
- Node.js  
- Express.js  

## Database
- MongoDB  

## Other
- REST API  
- JWT Authentication  
- OTP (Email-based)  

---

# 📌 Version 1 Scope

## ✔ Completed:
- Authentication system  
- Event creation  
- Token generation  
- QR scanning & verification  
- Admin dashboard  
- Live entry tracking  

## ❌ Not included (Future scope):
- Notifications  
- Multi-mess support UI  
- Analytics charts  
- Mobile app  

---

# 📌 Future Enhancements

- 📱 Mobile app version  
- 🔔 Notifications for event start  
- 📊 Advanced analytics (graphs)  
- 🧾 Entry history for students  
- 🏢 Multi-mess management system  