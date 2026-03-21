# MERN Stack Portfolio Website

A full-stack portfolio website built for a Computer Science student using the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first UI using Tailwind CSS.
- **Dark/Light Mode**: Persists user preference using Context API and `localStorage`.
- **Animations**: Smooth scroll effects and component entrance using Framer Motion.
- **Projects Showcase**: Fetch projects from API, filter by category.
- **Contact Form**: Connects to the backend and sends an email via Nodemailer.
- **Admin Dashboard**: Secure JWT-powered dashboard to manage projects.

## Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- React Icons

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcrypt (Password Hashing)
- Nodemailer

## Environment Variables

Create a `.env` file in the root or `server` directory:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
JWT_SECRET=your_jwt_secret_key
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

## Running Locally

1. **Install Dependencies**
   ```bash
   # In terminal 1: Root / Backend
   cd portfolio-mern/server
   npm install

   # In terminal 2: Frontend
   cd portfolio-mern/client
   npm install
   ```

2. **Start the Development Servers**
   ```bash
   # Terminal 1: Start Backend (Port 5000)
   cd portfolio-mern/server
   node server.js

   # Terminal 2: Start Frontend (Port 5173)
   cd portfolio-mern/client
   npm run dev
   ```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (Protected)
- `PUT /api/contact/:id` - Mark message as read (Protected)

### Auth
- `POST /api/auth/login` - Admin login

## Setup Admin & Seed Data

You must insert an Admin record into the `admins` collection in your MongoDB to login to the dashboard. The password should be hashed with `bcrypt`. You can manually seed projects directly into MongoDB Atlas.
