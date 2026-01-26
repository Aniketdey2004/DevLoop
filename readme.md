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

- RESTful API architecture  
- Client-server separation  
- OAuth-based integrations  
- Role-aware API access  
- Cached server-state driven UI  

---