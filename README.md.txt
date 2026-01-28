# Group Expense Tracker (MERN)

A full‑stack MERN application to manage shared expenses within groups (trips, roommates, events). Users can sign up, create or join groups via invite codes, add expenses, and see who owes whom.

## Features

- **User Auth** – Register & login with JWT‑based authentication.
- **Group Management** – Create groups with unique invitation codes, join existing groups.
- **Expense Tracking** – Add expenses with title, amount, date, payer; support **equal** and **custom** splits.
- **Balances & Settlements** – Automatic per‑member balances and “who pays whom” suggestions.
- **Responsive UI** – Built with React and React‑Bootstrap.

---

## Tech Stack

- **Frontend:** React 18, React Router 6, React Bootstrap, Axios
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB (Atlas or local)
- **Auth:** JSON Web Tokens (JWT)
- **Dev Tools:** Nodemon, React Scripts

---

## Project Structure
mern-project/
├─ backend/
│ ├─ config/ # MongoDB connection (db.js)
│ ├─ controller/ # authController, groupsController, expensesController
│ ├─ models/ # User, Group, Expense schemas
│ ├─ routes/ # auth, group, expenses routes
│ ├─ middleware/ # auth middleware (JWT)
│ ├─ .env # backend environment variables
│ ├─ server.js # Express app entry
│ └─ package.json
└─ frontend/
├─ public/ # index.html
├─ src/
│ ├─ components/ # Dashboard, Login, Register, GroupList, etc.
│ ├─ services/ # api.js (Axios client)
│ ├─ App.js # React root component + routes
│ ├─ index.js # React entry point
│ └─ App.css
└─ package.json

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) account **or** local MongoDB
- npm or yarn

---

## Backend Setup (`backend/`)

1. **Install dependencies**

   cd backend
   npm install

2. Create .env

   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/expense-tracker?retryWrites=true&w=majority
   JWT_SECRET=your-long-random-secret
   PORT=5000   
3. Run the server

   npm run dev
---

## frontend Setup (`frontend/`)

1.Install dependencies
   
   cd ../frontend
   npm install

2.Run the React app

  npm start

Using the Application

Register
Navigate to http://localhost:3000/register.
Enter your name, email, and password (min 6 characters).
On success, you’re logged in and redirected to the Dashboard.

Login
Use your email and password at http://localhost:3000/login.

Create a Group
On the Dashboard, click “Create Group”.
Enter a group name and optional description.
A unique invitation code is generated and shown in the group list.

Join a Group
Click “Join Group”.
Enter the invitation code shared by another user.
You’ll be added to that group as a member.

Add an Expense
Select a group from the left sidebar.
Click “Add Expense”.
Fill in:
Title
Amount
Date
Payer (which member paid)
Split Type:
Equal – splits amount equally among all group members
Custom – manually enter amounts per member; totals must match the amount
Submit to save the expense.

View Balances & History
Balances: Shows each member’s total paid, total owed, and net balance.
Settlement Suggestions: Shows “X should pay Y ₹Z” style recommendations.
Expense History: Table of all past expenses with who paid and how it was split.

