# Basundhara Bio-Tech - Research & Innovation Platform

Basundhara Bio-Tech is a modern, responsive full-stack MERN application representing a high-end biotech startup. The system combines scientific design aesthetics, a secure JWT-authenticated Node/Express REST API, and a Mongoose-modeled MongoDB database with a robust admin dashboard.

---

## Repository Structure

```
ag7_basundhara_bio-tech/
│
├── client/                     # React SPA Frontend (Vite + Bootstrap 5)
│   ├── public/
│   └── src/
│       ├── components/         # DNAAnimation, Navbar, Footer, ProtectedRoute
│       ├── context/            # AuthContext (login, register, logout, dark/light theme)
│       ├── pages/              # Home, About, Services, Research, Blog, Contact, Login, Register, AdminDashboard, NotFound
│       ├── services/           # Axios API Client
│       ├── styles/             # theme.css (glassmorphism, variables, animations)
│       ├── App.jsx             # React Routes config
│       └── main.jsx            # Entry point
│
├── server/                     # Node.js Express REST API Backend
│   ├── config/                 # db.js (Mongoose connection)
│   ├── controllers/            # auth, blog, research, service, contact, analytics controllers
│   ├── middleware/             # auth, error, validation, rate limiting middlewares
│   ├── models/                 # User, Service, Blog, Research, Contact schemas
│   ├── routes/                 # Express API router definitions
│   ├── utils/                  # seed.js (Database pre-population script)
│   ├── server.js               # Entry script
│   └── .env                    # Local environment config
│
└── README.md                   # This instruction manual
```

---

## Technology Stack

- **Frontend**: React (Hooks, Context), React Router DOM (v6), Axios, Bootstrap 5, Bootstrap Icons, HTML5 Canvas API (DNA animation)
- **Backend**: Node.js, Express.js, MVC Architecture
- **Database**: MongoDB (Mongoose schemas)
- **Security**: JWT tokens, Bcryptjs password hashing, CORS, Express-Rate-Limit
- **Dev Tools**: Nodemon, Dotenv

---

## Local Setup & Installation

Follow these steps to run the application locally on your Windows machine.

### 1. Prerequisites
- **Node.js** (v16.x or higher)
- **MongoDB** running locally (on default port `27017`) or a **MongoDB Atlas** cloud cluster URI.

### 2. Configure Backend Environment
1. Navigate to the `server/` directory.
2. Edit or verify the variables inside the `server/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/basundhara-biotech
   JWT_SECRET=basundhara_secret_jwt_token_key_987654321
   NODE_ENV=development
   ```

### 3. Install & Seed Database
1. Run server setup commands:
   ```bash
   cd server
   npm install
   ```
2. Run the database seed script to populate default data (research papers, services, blogs, contact messages, and users):
   ```bash
   npm run seed
   ```

### 4. Install & Start Frontend Client
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   npm install
   ```
2. Launch the Vite local dev server:
   ```bash
   npm run dev
   ```
   *The frontend client will open on `http://localhost:5173/` by default.*

### 5. Start Backend Server
1. Return to the `server/` directory and run the dev server:
   ```bash
   cd ../server
   npm run dev
   ```
   *The backend engine starts on `http://localhost:5000/`.*

---

## Test Credentials

Use these pre-seeded accounts to explore the application:

- **Administrator Clearance (Dashboard Access)**
  - Email: `admin@basundharabiotech.com`
  - Password: `admin12345`

- **Standard User Clearance**
  - Email: `user@basundharabiotech.com`
  - Password: `user12345`

---

## REST API Endpoints

### 1. Authentication (`/api/auth`)
- `POST /register` - Register a new account (validates name, email, password)
- `POST /login` - Login to account (returns JWT token)
- `GET /profile` - Retrieve account profile (clearance required)

### 2. Biotechnology Services (`/api/services`)
- `GET /` - Retrieve all services
- `GET /:id` - Retrieve individual service specs
- `POST /` - Create a service (Admin only)
- `PUT /:id` - Update service details (Admin only)
- `DELETE /:id` - Remove service offering (Admin only)

### 3. Scientific Blogs (`/api/blogs`)
- `GET /` - Fetch published blogs (supports search query, tag filtering, pagination)
- `GET /slug/:slug` - Fetch individual blog by slug
- `POST /` - Publish blog post (Admin only)
- `PUT /:id` - Modify blog details (Admin only)
- `DELETE /:id` - Delete blog post (Admin only)

### 4. Research Publications (`/api/research`)
- `GET /` - Fetch publications (supports searching, category filters, pagination)
- `GET /:id` - Fetch single paper specs
- `POST /` - Add publication (Admin only)
- `PUT /:id` - Update publication metadata (Admin only)
- `DELETE /:id` - Delete publication record (Admin only)

### 5. Inquiries & Contacts (`/api/contacts`)
- `POST /` - Submit contact inquiry (Public)
- `GET /` - Retrieve all messages (Admin only)
- `PUT /:id` - Update status (unread, read, replied) (Admin only)
- `DELETE /:id` - Delete message (Admin only)

### 6. Analytics Console (`/api/analytics`)
- `GET /` - Retrieve aggregate statistics, message statuses, and category splits (Admin only)

---

## Production Deployment Prep

- **Frontend**: The Vite config is build-optimized. Run `npm run build` in the `client/` folder to output static files in `client/dist/`, which are ready for hosting on Vercel or Netlify. Make sure to specify the production `VITE_API_URL` environment variable.
- **Backend**: Update `NODE_ENV=production` and change the `MONGODB_URI` inside `server/.env` to reference a secure MongoDB Atlas production cluster connection string. Deploy to Render, Railway, or Heroku.
