# Employee Feedback System

A full-stack web application that enables employees to submit feedback and administrators to manage and review all feedback submissions. The system provides role-based access control with separate functionalities for employees and administrators.

## 🌟 Features

### For Employees (Role: 0)
- **User Authentication**: Secure registration and login system
- **Submit Feedback**: Create and submit feedback to the organization
- **View Personal Feedback**: Access and review previously submitted feedback
- **Edit Feedback**: Update existing feedback submissions
- **Profile Management**: View personal profile information

### For Administrators (Role: 1)
- **View All Feedback**: Access and review feedback from all employees
- **Feedback Management**: View detailed feedback information
- **Delete Feedback**: Remove inappropriate or outdated feedback
- **User Management**: Access to user information and roles
- **Admin Dashboard**: Centralized interface for feedback oversight

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.0) - UI library for building interactive user interfaces
- **React Router DOM** (v7.11.0) - Client-side routing
- **Axios** (v1.13.2) - HTTP client for API requests
- **Vite** (v7.2.4) - Fast build tool and development server
- **ESLint** - Code quality and consistency

### Backend
- **Node.js** - JavaScript runtime
- **Express** (v5.2.1) - Web application framework
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** (v9.1.2) - MongoDB object modeling
- **JWT (JSON Web Tokens)** (v9.0.2) - Authentication and authorization
- **bcryptjs** (v2.4.3) - Password hashing
- **CORS** (v2.8.5) - Cross-Origin Resource Sharing

## 📋 Prerequisites

Before running this project, ensure you have:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/aradhanahingane/EmployeeFeedbackSystem.git
cd EmployeeFeedbackSystem
```

### 2. Backend Setup

#### Navigate to the backend directory:
```bash
cd employee-feedback-backend
```

#### Install dependencies:
```bash
npm install
```

#### Configure MongoDB:
- **Option 1**: Use local MongoDB
  - Start MongoDB service on your machine
  - The default connection URL is `mongodb://localhost:27017/login`

- **Option 2**: Use MongoDB Atlas
  - Create a MongoDB Atlas account and cluster
  - Get your connection string
  - Set the `MONGO_URL` environment variable

#### Set environment variables (optional):
Create a `.env` file in the backend directory:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/login
JWT_SECRET=your_jwt_secret_key
```

#### Start the backend server:
```bash
npm start
```
The backend will run on `http://localhost:3000`

### 3. Frontend Setup

#### Navigate to the frontend directory:
```bash
cd ../employee-feeback-frontend
```

#### Install dependencies:
```bash
npm install
```

#### Start the development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173` (or another port if 5173 is in use)

## 📖 Usage Guide

### User Registration & Login

1. **Register a New Account**
   - Navigate to the registration page
   - Provide username, email, and password
   - Select role (Employee: 0, Admin: 1)
   - Submit the registration form

2. **Login**
   - Navigate to the login page
   - Enter your credentials
   - Upon successful login, you'll be redirected based on your role

### Employee Workflow

1. **Submit Feedback**
   - After login, navigate to the feedback page
   - Enter your feedback in the text area
   - Click submit to create new feedback

2. **View & Edit Feedback**
   - View all your previously submitted feedback
   - Click on any feedback to edit it
   - Update the text and save changes

### Administrator Workflow

1. **Access Admin Dashboard**
   - Login with admin credentials (role: 1)
   - Access the admin dashboard

2. **Review Feedback**
   - View all feedback submissions from employees
   - See employee names, feedback text, and submission timestamps

3. **Delete Feedback**
   - Click delete on any feedback entry
   - Confirm deletion when prompted

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs before storage
- **JWT Authentication**: Secure token-based authentication system
- **Role-Based Access Control**: Different permissions for employees and administrators
- **Protected Routes**: Middleware validation for authenticated routes
- **Input Validation**: Server-side validation for all user inputs

## 📁 Project Structure

```
EmployeeFeedbackSystem/
├── employee-feedback-backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── db.js                 # MongoDB schemas and models
│   │   ├── middleware/
│   │   │   └── auth.js               # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js               # Authentication routes
│   │   │   └── feedback.js           # Feedback CRUD routes
│   │   ├── utils/                    # Utility functions
│   │   └── index.js                  # Server entry point
│   ├── package.json
│   └── .gitignore
│
├── employee-feeback-frontend/
│   ├── src/
│   │   ├── AdminDashboard.jsx        # Admin dashboard component
│   │   ├── Feedback.jsx              # Employee feedback component
│   │   ├── Login.jsx                 # Login page
│   │   ├── Register.jsx              # Registration page
│   │   ├── Home.jsx                  # Home page
│   │   ├── UserContext.jsx           # User context for state management
│   │   ├── api.js                    # API service functions
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and receive JWT token
- `GET /users/me` - Get current user profile (protected)

### Feedback
- `POST /feedback` - Create new feedback (Employee only)
- `GET /feedback` - Get feedbacks (Employee: own, Admin: all)
- `GET /feedback/:id` - Get single feedback by ID
- `PUT /feedback/:id` - Update feedback (Employee only, own feedback)
- `DELETE /feedback/:id` - Delete feedback (Admin only)

### Health Check
- `GET /` - API health check

## 🧪 Development

### Frontend Development
```bash
cd employee-feeback-frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend Development
```bash
cd employee-feedback-backend
npm start        # Start the server
```

## 🤝 Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

## 📝 License

This project is available for educational and personal use.

## 👤 Author

**Aradhana Hingane**
- GitHub: [@aradhanahingane](https://github.com/aradhanahingane)

## 🐛 Known Issues

- Ensure MongoDB is running before starting the backend server
- The frontend expects the backend to run on port 3000 by default

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Note**: This is a learning project demonstrating full-stack development with React, Node.js, Express, and MongoDB.