
# 🤖 CodaAI — One Interface. Multiple Models. Endless Possibilities.

CodaAI is an open-source, extensible AI chat platform that brings multiple Large Language Models (LLMs) together in one unified interface. It aims to make AI interactions more flexible through multi-model integration, conversational experiences, voice capabilities, and multilingual support.

The goal is to build more than another AI chatbot: a platform that developers can explore, extend, and build upon.

---

## ✨ Key Features

- **Multi-LLM Architecture:** Integrate and interact with multiple AI model providers through one platform.
- **Conversational AI:** Engage with AI through an intuitive chat experience.
- **Voice Interaction:** Explore voice-enabled AI conversations.
- **Multilingual Support:** Work towards making AI interactions accessible across languages.
- **Secure Authentication:** User authentication with GitHub, Google, and email-based verification.
- **Extensible Architecture:** Designed to accommodate additional models, integrations, and capabilities.

> Feature availability may vary as development progresses.

---

## 🏗️ Architecture

CodaAI follows a modular architecture designed to connect the user interface, authentication, database, and AI model providers.

```mermaid
flowchart TD
    A[User] --> B[Next.js Frontend]
    B --> C[Authentication]
    C --> D[Application Backend]
    D --> E[AI Integration Layer]
    E --> F[LLM Provider 1]
    E --> G[LLM Provider 2]
    E --> H[LLM Provider N]
    D --> I[Prisma ORM]
    I --> J[(PostgreSQL)]
    D --> K[Voice & Language Features]
```

### Architecture Components

| Component | Technology |
|---|---|
| Frontend & Application | Next.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Better Auth |
| AI Integration | Multiple LLM APIs |
| Deployment | Vercel (planned) |

---

## 🛠️ Tech Stack

- Next.js 16
- TypeScript
- Prisma ORM 5
- PostgreSQL
- Better Auth
- AI provider APIs
- Docker (database development)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- npm
- PostgreSQL or Docker
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/codaai"

BETTER_AUTH_SECRET="your-secure-secret"
BETTER_AUTH_URL="http://localhost:3000"

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Configure API keys required by your enabled AI providers
```

Never commit your `.env` file or expose API credentials.

### 4. Initialize the database

```bash
npx prisma generate
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Configure environment variables and authentication providers according to the project's implementation.

---

## 📸 Screenshots

Screenshots and application previews will be added here as the interface evolves.

| Chat Interface | AI Conversations |
|---|---|
| Add screenshot | Add screenshot |

---

## 🗺️ Roadmap

- [x] Initial application foundation
- [x] PostgreSQL and Prisma integration
- [x] Authentication integration
- [ ] Expand multi-provider LLM integration
- [ ] Improve model selection and management
- [ ] Enhance voice-based conversations
- [ ] Expand multilingual capabilities
- [ ] Introduce advanced AI workflows
- [ ] Explore agentic AI capabilities
- [ ] Strengthen security and automated testing
- [ ] Production deployment and community contributions

---

## 🔐 Security

Security is an important part of CodaAI's development.

The project aims to follow secure development practices, including:

- Secure authentication and session management.
- Protection of API credentials and environment secrets.
- Database access controls.
- Dependency and vulnerability monitoring.
- Secure handling of user conversations and data.

If you discover a security vulnerability, please report it responsibly rather than publishing sensitive exploit details.

---

## 🤝 Contributing

CodaAI aims to grow as a community-driven open-source project.

Contributions, suggestions, bug reports, and feature requests are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your implementation.
5. Submit a pull request with a clear description.

---

## 🎯 Vision

The long-term vision of CodaAI is to create an extensible AI platform where developers and users can access different AI models, experiment with emerging capabilities, and build more intelligent conversational experiences without being restricted to a single model provider.

**Built with curiosity, experimentation, and a commitment to open-source innovation.**

---

## 👨‍💻 Author

**Gaurav Salunke**

GitHub: [gaurav-cloud-agentic-dev](https://github.com/gaurav-cloud-agentic-dev)

---

⭐ If you find CodaAI interesting, consider starring the repository and contributing to its development.
