# 🚀 DevLoop — Developer Social Networking & Collaboration Platform

DevLoop is a developer-first platform that brings together **social networking**, **project showcasing**, and **GitHub-backed collaboration** into a single ecosystem.

It allows developers to share posts, engage with other developers’ work, and build a professional presence, while also enabling structured, credibility-driven collaboration on real projects. By integrating deeply with GitHub, DevLoop emphasizes **authentic work, real contributions, and meaningful collaboration**.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Core Philosophy](#-core-philosophy)
- [Key Features](#-key-features)
- [Project Types](#-project-types)
- [Authentication & Authorization](#-authentication--authorization)
- [User Profiles](#-user-profiles)
- [Social Networking](#-social-networking)
- [Collaboration Workflow](#-collaboration-workflow)
- [Project Discussions](#-project-discussions)
- [Notifications & Emails](#-notifications--emails)
- [Media & File Handling](#-media--file-handling)
- [GitHub Integration](#-github-integration)
- [Security & Best Practices](#-security--best-practices)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
---

## 🧠 Overview

DevLoop is built for developers who want to:

- Share updates, ideas, and work with the developer community  
- Showcase projects professionally  
- Discover interesting development work  
- Collaborate with like-minded developers  
- Maintain credibility through GitHub-backed projects  
- Communicate effectively within project teams  

The platform enforces **clear collaboration boundaries** and avoids unsolicited or spammy invites by allowing **only followers** to request collaboration.

---

## 🎯 Core Philosophy

- Authenticity over vanity  
- GitHub-backed proof of work  
- Structured collaboration over random invites  
- Social interaction with professional context  
- Async-first communication for scalability  

GitHub acts as the **source of truth** for developer identity and contributions.

---

## ✨ Key Features

- Developer-centric social profiles  
- Normal social posts (text & images)  
- GitHub-backed collaboration projects  
- Portfolio projects for showcasing work  
- Social feed with likes, comments, and shares  
- Follow-based discovery and engagement  
- Controlled and spam-free collaboration requests  
- Project-specific discussion panels  
- Automated GitHub repository invitations  

---

## 🗂 Project Types

DevLoop supports **two distinct project types**.

### 1️⃣ Portfolio Projects

- Used purely for showcasing work  
- No collaboration requests allowed  
- Ideal for completed or personal projects  
- Visible on user profiles  
- GitHub repository required  
- Commit history validated for credibility  

---

### 2️⃣ Collaboration Projects

- Designed for active, team-based development  
- GitHub repository is mandatory  
- Automatically shared to followers’ feeds as posts  
- Only followers can request collaboration  
- Includes a private discussion panel  

---

## 🔐 Authentication & Authorization

### Authentication Methods

- Email & Password authentication  
- Google Login (OAuth 2.0 with OpenID Connect)  

### Security Details

- Passwords hashed using **bcrypt**  
- JWT-based authentication  
- Secure HTTP-only cookies (where applicable)  
- Token-based session validation  
- Encrypted OAuth credentials  

### GitHub Account Linking

- Implemented using GitHub OAuth 2.0  
- Mandatory for all project creation  
- Required for:
  - Sending collaboration requests  
  - Accepting collaboration requests  
  - Creating any type of project  

---

## 👤 User Profiles

Each user has a customizable developer profile containing:

- Profile picture  
- Headline & bio  
- GitHub-linked identity  
- Education  
- Skills  
- Projects (portfolio & collaboration)  
- Social metrics (followers)  

---

## 🌐 Social Networking

DevLoop functions as a developer-centric social network alongside its collaboration features.

### Feed

- Text-based posts  
- Image posts  
- Auto-generated collaboration project posts  
- Chronological feed with engagement  

### Engagement

- Like posts  
- Comment on posts  
- Share posts  
- Follow / unfollow developers  

### Discovery

- User discovery via feed activity  
- Project discovery through collaboration posts  

---

## 🤝 Collaboration Workflow

DevLoop enforces a structured, spam-free collaboration process:

1. User creates a collaboration project  
2. Project is automatically posted to followers’ feeds  
3. Followers can request collaboration  
4. Project owners can accept or reject requests  
5. Project owners cannot invite users directly  

### On Acceptance

- Automatic GitHub repository invitation sent  
- Only collaborators gain access to:
  - Project discussion panel  
  - Internal project context  

> ⚠️ All collaborations are GitHub-backed to ensure real contributions.

---

## 💬 Project Discussions

Each collaboration project includes a dedicated discussion panel:

- Accessible only to collaborators  
- Forum-style async discussions  
- Inspired by GitHub Issues & LeetCode Discussions  

### Ideal for

- Design discussions  
- Task updates  
- Architectural decisions  
- Async team communication  

---

## 🔔 Notifications & Emails

### In-App Notifications

- Likes  
- Comments  
- New followers  
- Collaboration request accepted  
- Collaboration request rejected  

### Emails

- Welcome email on registration  
- Sent using **Mailtrap**  

---

## 🖼 Media & File Handling

- Cloudinary integration for:
  - User avatars  
  - Profile banners  
  - Post image attachments  

> Project-level image uploads are intentionally disabled to keep focus on code and collaboration.

---

## 🔗 GitHub Integration

### OAuth 2.0

- Secure GitHub account linking  
- Required for collaboration features  

### Repository Validation

- GitHub repository required for all projects  
- Portfolio projects validate commit history  
- Repository ownership and credibility verified for collaboration projects

### Automated Invites

- GitHub repository invitations sent automatically on collaboration acceptance  

---

## 🛡 Security & Best Practices

- Bcrypt password hashing  
- JWT-protected routes  
- Role-based access control  
- Secure OAuth flows  
- API-level authorization checks  
- Encrypted sensitive user data  
- Server-state management using **TanStack Query**  

---

## 🧰 Tech Stack

### Frontend

- React.js  
- Tailwind CSS  
- DaisyUI  
- Lucide React  
- TanStack Query  

### Backend

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- Mailtrap  
- Cloudinary  

### OAuth & External Services

- Google OAuth 2.0 + OpenID Connect  
- GitHub OAuth 2.0  

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (React)                            │
│  ┌───────────────┐  ┌─────────────────┐  ┌──────────────────┐   │
│  │ TanStack      │  │  React Router   │  │   Local State    │   │
│  │ Query         │  │                 │  │                  │   │
│  │ (Server State)│  │  (Navigation)   │  │                  │   │
│  └───────────────┘  └─────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)                   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     API Routes                           │    │
│  │  /api/v1/auth     → Authentication & OAuth               │    │
│  │  /api/v1/users    → User profiles & follows              │    │
│  │  /api/v1/posts    → Social feed & engagement             │    │
│  │  /api/v1/projects → Portfolio & collaboration projects   │    │
│  │  /api/v1/collab   → Collaboration requests               │    │
│  │  /api/v1/discussions → Project discussions               │    │
│  │  /api/v1/notifications → User notifications              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Middleware Layer                       │    │
│  │  • JWT Authentication (protectRoute)                     │    │
│  │  • Collaborator Verification (discussion access)         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────────┐  │
│  │  MongoDB  │  │ Cloudinary│  │  Mailtrap │  │ GitHub API  │  │
│  │  Database │  │ Image CDN │  │   Email   │  │   OAuth &   │  │
│  │           │  │           │  │  Service  │  │  Repo Mgmt  │  │
│  └───────────┘  └───────────┘  └───────────┘  └─────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Google OAuth 2.0                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Mailtrap account
- Google Cloud Console project (OAuth credentials)
- GitHub OAuth App

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aniketdey2004/DevLoop.git
   cd devloop
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#-environment-variables))

4. **Run the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open the app** at `http://localhost:5173`

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
ATLAS_DB=mongodb+srv://username:password@cluster.mongodb.net/devloop

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mailtrap
MAILTRAP_TOKEN=your_mailtrap_token

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# GitHub Token Encryption (32 bytes hex = 64 characters)
GITHUB_TOKEN_ENCRYPTION_KEY=your_64_character_hex_string

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

### Frontend (`frontend/.env`)

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register with email/password |
| POST | `/login` | Login with credentials |
| POST | `/logout` | Logout user |
| GET | `/me` | Get current user |
| POST | `/google` | Google OAuth login |
| GET | `/github` | Initiate GitHub OAuth |
| GET | `/github/callback` | GitHub OAuth callback |

### Users (`/api/v1/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/suggested` | Get suggested users |
| GET | `/:username` | Get user profile |
| PUT | `/profile` | Update profile |
| POST | `/follow/:id` | Follow/unfollow user |

### Posts (`/api/v1/posts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get feed posts |
| GET | `/:id` | Get single post |
| POST | `/create` | Create new post |
| DELETE | `/:id` | Delete post |
| POST | `/:id/like` | Like/unlike post |
| POST | `/:id/comment` | Add comment |

### Projects (`/api/v1/projects`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/my` | Get my projects |
| GET | `/:id` | Get project details |
| GET | `/user/:userId` | Get user's projects |
| POST | `/` | Create project |
| PUT | `/:id` | Update project |
| DELETE | `/:id` | Delete project |

### Collaboration (`/api/v1/collab`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/requests` | Get pending requests |
| GET | `/status/:projectId` | Get collab status |
| POST | `/request/:projectId` | Send collab request |
| POST | `/accept/:requestId` | Accept request |
| POST | `/reject/:requestId` | Reject request |

### Discussions (`/api/v1/discussions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:projectId` | Get project discussions |
| POST | `/:projectId` | Post discussion message |

### Notifications (`/api/v1/notifications`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all notifications |
| PUT | `/:id/read` | Mark as read |
| DELETE | `/:id` | Delete notification |

---

## 📁 Project Structure

```
devloop/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── post.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── collab.controller.js
│   │   │   ├── discussion.controller.js
│   │   │   └── notification.controller.js
│   │   ├── emails/
│   │   │   ├── emailHandler.js
│   │   │   └── emailTemplate.js
│   │   ├── lib/
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   ├── mailtrap.js
│   │   │   └── utils.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── discussion.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Project.js
│   │   │   ├── CollabRequest.js
│   │   │   ├── ProjectDiscussion.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   ├── user.route.js
│   │   │   ├── post.route.js
│   │   │   ├── project.route.js
│   │   │   ├── collab.route.js
│   │   │   ├── discussion.route.js
│   │   │   └── notification.route.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## 💡 Usage

1. **Sign up** with email/password or Google OAuth
2. **Link GitHub** account to enable project features
3. **Create your profile** — add skills, experience, education
4. **Share posts** — text updates or images
5. **Create projects**:
   - **Portfolio**: Showcase your work (requires commit history)
   - **Collaboration**: Find teammates (auto-posts to followers)
6. **Discover developers** — follow interesting profiles
7. **Request collaboration** — only on projects from users you follow
8. **Discuss** — use project discussion panels for team communication
9. **Get notified** — likes, comments, follows, and collab updates

---

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Aniket Dey**

- GitHub: [@Aniketdey2004](https://github.com/Aniketdey2004)

---

⭐ Star this repo if you found it helpful!
