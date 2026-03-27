# 📋 MyPlanner — Task Management System

> A lightweight, browser-based daily planner built with Java (Spring Boot) and React.  
> *Mini Project for Object Oriented Programming using Java (23AML136)*  
> Department of Artificial Intelligence & Machine Learning, BNM Institute of Technology

---

## 📌 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [References](#references)
- [Authors](#authors)

---

## 🧭 Overview

**MyPlanner** is a full-stack task management web application designed to bridge the gap between overly simple note-taking tools and heavyweight project management software. It provides students and entry-level professionals with a clean, intuitive interface for organizing their daily activities — without the steep learning curve of complex platforms.

The system allows users to create, view, update, and delete tasks; group them by time of day; estimate durations; add subtask notes; and rely on a persistent relational database so nothing is ever lost between sessions.

---

## 🔍 Problem Statement

Students and professionals today face a significant productivity challenge. Informal methods like sticky notes or basic reminders are chaotic and easily lost, while enterprise-grade tools are overwhelming for users who only need core features. Specifically:

- Informal task-tracking lacks structure and persistence, making it easy to forget work.
- It is difficult to visually distinguish between completed and pending tasks.
- Most existing tools impose a steep learning curve on beginners.
- There is no straightforward way to plan a day by time-of-day segments with duration awareness.

MyPlanner was developed to address these gaps — serving as both a practical daily planning tool and an educational demonstration of integrating a Java backend with a modern JavaScript frontend.

---

## 🎯 Objectives

The project was built to achieve four key goals:

| Objective | Description |
|---|---|
| **Record with Detail** | Enable users to break down complex tasks into smaller, actionable steps using notes and subtasks. |
| **Plan Your Day with Intention** | Categorize activities by Morning, Day, or Evening segments and assign approximate durations. |
| **Gain Instant Visual Clarity** | Provide a clean, easy-to-scan layout where all pending work is immediately visible on the dashboard. |
| **Never Lose a Task Again** | Ensure task data and completion statuses persist across browser sessions via robust database storage. |

---

## ✅ Features

### Core Features (In Scope)

- **Full CRUD Operations** — Create, Read, Update, and Delete tasks through a clean form interface.
- **Time-Based Categorization** — Organize tasks into three time-of-day segments: *Morning*, *Day*, and *Evening*.
- **Duration Estimation** — Assign a time estimate (e.g., 45 minutes) to each task for realistic daily planning.
- **Subtask Support** — Break a task down into subtasks/notes for finer-grained tracking.
- **Completion Toggle** — Mark tasks as complete with an instant visual status transition.
- **Persistent Storage** — All data is saved in a relational database (MySQL/PostgreSQL) and survives browser restarts.
- **Personalized Dashboard** — A home screen greeting that immediately surfaces the count of pending tasks for the day.
- **Calendar View** — A weekly calendar panel displaying scheduled activities at a glance.

---

## 🏗️ System Architecture

MyPlanner follows a classic three-tier architecture:

```
User Interaction
      │
      ▼
┌─────────────────────────────────┐
│       Presentation Layer        │
│         React + Vite            │
│  • Task Dashboard               │
│  • Calendar View                │
│  • Analytics Dashboard          │
│  • AI Voice Interface           │
│  • Team Collaboration UI        │
└────────────┬────────────────────┘
             │  REST API (JSON)
             ▼
┌─────────────────────────────────┐
│       Application Layer         │
│      Java + Spring Boot         │
│  • REST Controllers             │
│  • Task CRUD Services           │
│  • Calendar Scheduling          │
│  • Analytics Processing         │
│  • AI Voice Services            │
│  • Team Management              │
└────────────┬────────────────────┘
             │  SQL
             ▼
┌─────────────────────────────────┐
│          Data Layer             │
│      MySQL / PostgreSQL         │
│  • Tasks Data                   │
│  • Calendar Events              │
│  • Team Member Data             │
│  • Analytics Records            │
└─────────────────────────────────┘
             │
             ▼
     Display Updated Data
```

### How Data Flows

1. The user interacts with the **React frontend** (e.g., fills out an "Add Task" form).
2. The frontend sends a **REST API request** (e.g., `POST /tasks`) with a JSON payload to the Spring Boot backend.
3. The **Spring Boot service layer** processes the request and executes the appropriate SQL operation.
4. The **database** stores or retrieves the data and returns a response.
5. The frontend re-fetches (`GET /tasks`) and re-renders the view, keeping the UI always in sync with the database.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite |
| **Backend** | Java, Spring Boot |
| **Database** | MySQL / PostgreSQL |
| **API Style** | RESTful (JSON over HTTP) |
| **Build Tool** | Maven / Gradle |

---

## 📁 Project Structure

```
JavaProject-3rd-sem/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/myplanner/
│   │   │   │       ├── controller/    # REST Controllers
│   │   │   │       ├── service/       # Business Logic
│   │   │   │       ├── model/         # Entity Classes (Task, etc.)
│   │   │   │       └── repository/    # JPA Repositories
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Dashboard, Calendar, Task Manager
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

> **Note:** The actual directory structure in the repository may vary slightly from the above.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Java** 17 or later
- **Node.js** 18 or later and **npm**
- **MySQL** or **PostgreSQL**
- **Maven** or **Gradle**

### 1. Clone the Repository

```bash
git clone https://github.com/Prakya-tech105/JavaProject-3rd-sem.git
cd JavaProject-3rd-sem
```

### 2. Set Up the Database

Create a new database in MySQL or PostgreSQL:

```sql
CREATE DATABASE myplanner;
```

### 3. Configure the Backend

Open `backend/src/main/resources/application.properties` and update the database credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/myplanner
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
```

### 4. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend server will start at `http://localhost:8080`.

### 5. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | Fetch all tasks |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/{id}` | Update a task (e.g., mark complete) |
| `DELETE` | `/tasks/{id}` | Delete a task |

### Example: Create a Task

**Request**
```http
POST /tasks
Content-Type: application/json

{
  "title": "Grocery Shopping",
  "duration": "45 minutes",
  "segment": "Morning",
  "subtasks": ["Milk", "Bread", "Eggs"]
}
```

**Response**
```json
{
  "id": 1,
  "title": "Grocery Shopping",
  "duration": "45 minutes",
  "segment": "Morning",
  "completed": false,
  "subtasks": ["Milk", "Bread", "Eggs"]
}
```

---

## 🖥️ Usage

1. **Open the app** in your browser at `http://localhost:5173`.
2. The **Dashboard** greets you by name and shows how many tasks are pending for the day.
3. Navigate to the **Task Manager** using the sidebar.
4. Click **Add Task**, fill in the title, duration, time segment, and any subtasks, then submit.
5. Your task appears in the relevant time segment column.
6. Click the **checkmark** on any task to toggle its completion status — the visual style updates immediately.
7. Use the **Calendar View** from the sidebar to see a weekly overview of all scheduled activities.
8. Tasks and their statuses are automatically **saved to the database** and will be present the next time you open the app.

---

## 🔮 Future Enhancements

| Enhancement | Description |
|---|---|
| **Predictive Scheduling** | Use machine learning to suggest task scheduling based on historical user patterns and completion times. |
| **Native Mobile Apps** | Develop dedicated iOS and Android applications for a seamless on-the-go experience. |
| **Team Collaboration** | Introduce real-time task sharing, task assignment to team members, and role-based permissions. |

---

## 📚 References

- Gamma, E., et al. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software.*
- Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design.*
- S.300 (2024). "Task Management System using Java and Spring Boot," GitHub.
- "Task Manager App using MERN Stack" (2024). GeeksforGeeks.
- "Research Paper on Task Management Application" (2023). *IJIRT.*

---

## 👩‍💻 Authors

- **Prakya Kuncham**
- **G Thanusree**

**Guide:** Dr. Tejaswini R Murgod  
Department of Artificial Intelligence & Machine Learning  
BNM Institute of Technology, Banashankari 2nd Stage, Bengaluru – 560070

---

*Submitted: 31 December 2025 | Course: Object Oriented Programming using Java (23AML136)*
