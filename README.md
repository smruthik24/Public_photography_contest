# 📸 Public Photography Contest

A full-stack web application that hosts and manages open photography competitions. Built to celebrate creativity and visual storytelling, PPC enables photographers to register, upload entries, vote, and track contest results in a seamless and user-friendly platform.

---

## 🌟 Features

- **Contest Management** – Create, update, and publish contests with guidelines & deadlines.
- **User Participation** – Registration, photo submission, contest tracking.
- **Voting System** – Public or judge-based voting with fair scoring.
- **Result Declaration** – Automatic winner calculation based on votes/scores.
- **Community Interaction** – View and appreciate submissions.
- **Admin Dashboard** – Approve photos, manage contests, and monitor voting.
- **Secure Authentication** – JWT-based user & admin login.
- **Responsive Design** – Works on desktop, tablet, and mobile.

---

## 🏗 Architecture

### **Frontend (React.js)**
- Technology: React.js, JSX, CSS, JavaScript
- Key Components: `AdminDashboard`, `PhotoGallery`, `ContestForm`
- Features:
  - User registration/login
  - Photo submission
  - Contest listings & browsing
  - Voting & results
  - Admin panel for management

### **Backend (Node.js + Express.js)**
- Technology: Node.js, Express.js, MongoDB
- Structure:
  - `/apis` – REST API routes
  - `/models` – Mongoose schemas (`User`, `Contest`, `Photo`, `Vote`)
  - `/middleware` – Auth & validation logic
- Features:
  - JWT authentication
  - Secure file uploads
  - Role-based access
  - Voting logic & winner computation

### **Database (MongoDB)**
- Collections: Users, Contests, Photos, Votes
- Managed via Mongoose schemas

---

## 🚀 Setup Instructions

### **Prerequisites**
- Node.js (v16+)
- npm
- MongoDB (local or Atlas)


## 🧑‍💻 Installation

### 1. Clone the repository
```bash
git clone https://github.com/smruthik24/Public_photography_contest.git
cd Public_photography_contest
````

### 2. Install dependencies

#### For frontend:

```bash
cd client
npm install

#### For backend:

```bash
cd server
npm install
```
### 3. Environment Variables

Create a `.env` file in the `server` directory and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

```

---

## ⚙️ Running the App
### Frontend

```bash
cd client
npm run dev
```

### Backend

```bash
cd server
node index.js
```
### 👨‍💻 Authors
K. Smruthi
