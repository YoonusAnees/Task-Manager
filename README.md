# Task Manager With API

A simple RESTful API built with **Node.js**, **Express.js**, and **MongoDB** for managing tasks and users. This backend project allows users to create, read, update, and delete both users and tasks.

---

## 🚀 Features

- Create, read, update, and delete tasks
- Create, read, update, and delete users
- Input validation with Mongoose
- Error handling for invalid requests

---

## 📁 Project Structure

├── models
│ ├── User.js │ └── Task.js ├── routes
│ ├── userRoute.js │ └── taskRoute.js ├── src
│ ├── app.js │ └── db
│ └── mongoose.js ├── package.json └── README.md

---

## ⚙️ Getting Started

### Prerequisites

- Node.js
- MongoDB installed locally or via cloud (MongoDB Atlas)

### Installation

```bash
git clone https://github.com/your-username/task-manager-api.git
cd task-manager-api
npm install
Run the Project
bash
Copy
Edit
npm run dev
Ensure MongoDB is running before starting the app.

📫 API Endpoints
User Endpoints

Method	Route	Description
POST	/api/users	Create new user
GET	/api/users	Get all users
GET	/api/users/:id	Get a user by ID
PATCH	/api/users/:id	Update a user


Run the Project
bash
Copy
Edit
npm run dev

📫 API Endpoints
User Endpoints

Method	Route	Description
POST	/api/users	Create new user
GET	/api/users	Get all users
GET	/api/users/:id	Get a user by ID
PATCH	/api/users/:id	Update a user
