# Task Manager

A simple full-stack task manager built with **React** and **Flask**.

### 👨‍💻 Contributors

* **Backend:** Harif Hardi
* **Frontend:** Amoasi Emmanuel

## 🛠️ Technologies

* React
* TypeScript
* Python
* Flask
* Flask-SQLAlchemy
* SQLite

## 📋 About

This application allows users to:

* Create tasks
* View tasks
* Edit tasks
* Change task status
* Delete tasks
* Track when a task was created

The **React frontend** communicates with the **Flask REST API**, while Flask uses **SQLite** to store the tasks.

## ⚙️ Installation

### 1. Install Python

Download Python from:

https://www.python.org/downloads/

Check that Python is installed:

```bash
python --version
```

### 2. Install Node.js

The React frontend requires Node.js.

Download Node.js from:

https://nodejs.org/

Check the installation:

```bash
node --version
npm --version
```

### 3. Install DB Browser for SQLite

DB Browser for SQLite is optional. It allows you to **open and view the SQLite database visually**.

Download it from:

https://sqlitebrowser.org/dl/

You can open the `tasks.db` file with it and view the tasks stored in the database.

### 4. Clone the repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

## 🔧 Backend Setup

Go into the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install the required packages:

```bash
pip install Flask Flask-CORS Flask-SQLAlchemy
```

Start the Flask server:

```bash
python app.py
```

The backend runs on:

```text
http://localhost:8000
```

## 💻 Frontend Setup

Open another terminal and go to the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

Open the URL shown in the terminal.

## 🗄️ Database

The project uses **SQLite**, so you do not need to install a separate database server.

Flask-SQLAlchemy automatically creates the `tasks.db` database when the application starts.

If you want to inspect the database manually, you can use **DB Browser for SQLite**.

## 📄 License

This project was created for learning and practice.
