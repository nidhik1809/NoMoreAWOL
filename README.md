# 🚀 NoMoreAwol

**NoMoreAwol** is a full-stack Employee Productivity and Work Time Tracker designed to help managers monitor employee work patterns, assign tasks, track meetings, and analyze productivity — whether working from home or in the office.

---

## 🛠️ Tech Stack

### 🌐 Frontend
- **React.js**
- **Tailwind CSS**
- **Framer Motion** (for rich UI animations)

### ⚙️ Backend
- **Java Spring Boot**
- **Spring Security** (JWT-based authentication)
- **PostgreSQL**
- **Maven**

---

## 📁 Project Structure

NoMoreAwol/
├── NoMoreAwol-backend/ # Spring Boot backend
└── NoMoreAwol-frontend/ # React frontend

---

## 🔐 Features

### ✅ Authentication & Authorization
- [x] JWT-secured login and registration
- [x] Role-based access control (Employee vs Manager)

### ✅ Employee Dashboard
- [x] Clock-in/Clock-out functionality
- [x] Toggle between WFH / Office modes
- [x] Input lunch breaks & meeting details
- [x] View assigned tasks and work logs

### ✅ Manager Dashboard
- [x] Search and view employee details
- [x] Assign and update tasks
- [x] Schedule and manage meetings
- [x] Track productivity, idle time & employee stats
- [x] View task analytics (by status, priority, complexity)

---

## ⚙️ Getting Started

### 🔧 Backend Setup (Spring Boot)

1. Navigate to the backend folder:
   cd NoMoreAwol-backend
Configure your database and secrets in:
   src/main/resources/application.properties
Run the backend server:
   ./mvnw spring-boot:run
   
💻 Frontend Setup (React)
   Navigate to the frontend folder:
      cd NoMoreAwol-frontend
   Install all dependencies:
      npm install
   Start the frontend dev server:
      npm run dev


📝 To-Do
 Implement full API logic for:

 Clock-in/out, WFH tracking

 Meeting and task management

 Productivity stats

 Add productivity graphs and charts (D3 / Recharts)

 Dockerize frontend + backend

 Deploy to cloud (Render / Railway / Vercel)


🤝 Contributing
Pull requests are welcome!
For major feature changes, please open an issue to discuss your ideas beforehand.

📬 Contact
Nidhi Kulkarni
📧 nidhik.engg@gmail.com
🌐 LinkedIn

⭐️ Show Your Support
If you like this project, consider giving it a ⭐ on GitHub!
