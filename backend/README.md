# MyWorkout Backend API

Backend API for MyWorkout fitness tracking application with Groq AI integration for personalized workout recommendations.

## 🚀 Features

- **RESTful API** with Express.js
- **PostgreSQL Database** for data persistence
- **JWT Authentication** for secure access
- **Groq AI Integration** for intelligent workout recommendations
- **Multi-Agent AI System** inspired by LangGraph architecture:
  - **Optimus** (🔷) - Analytical and logical fitness analysis
  - **Bumblebee** (🟡) - Empathetic and humanistic approach
  - **Ratchet** (🟢) - Pragmatic and technical solutions
- **Docker Support** for easy deployment
- **Premium Features** gating for monetization

## 📦 Tech Stack

- **Node.js 18+** with ES Modules
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Groq AI** - AI model integration
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Docker & Docker Compose** - Containerization

## 🛠️ Installation

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- Docker and Docker Compose (optional)
- Groq API Key

### Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup PostgreSQL database:**
   ```bash
   # Create database
   createdb myworkout
   
   # Tables will be created automatically on first run
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

### Docker Setup

1. **Build and start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Workouts
- `GET /api/workouts` - Get all user workouts
- `POST /api/workouts` - Create new workout
- `GET /api/workouts/:id` - Get workout details
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/stats/summary` - Get workout statistics

### AI Coach (Premium)
- `POST /api/ai/advice` - Get multi-agent AI advice
- `POST /api/ai/weekly-plan` - Generate weekly workout plan
- `GET /api/ai/performance-analysis` - Analyze performance
- `POST /api/ai/simple-question` - Ask simple fitness question (free)

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/preferences` - Update preferences (language, theme)
- `PUT /api/users/password` - Change password

### Health Check
- `GET /health` - API health status

## 🤖 Groq AI Multi-Agent System

The AI coach uses a three-agent architecture for comprehensive fitness guidance:

### Optimus (🔷 Analytical)
- Data-driven analysis
- Performance metrics focus
- Executive perspective
- ROI and efficiency optimization

### Bumblebee (🟡 Empathetic)
- Human factors consideration
- Motivation and wellbeing
- Sustainable habits
- Emotional support

### Ratchet (🟢 Pragmatic)
- Practical solutions
- Risk identification
- Technical execution
- Reality-based recommendations

### Example Usage

```javascript
// Multi-agent consultation
POST /api/ai/advice
{
  "question": "Como posso melhorar minha força nos treinos de peito?"
}

// Response includes all three perspectives
{
  "agents": [
    { "agent": "optimus", "response": "..." },
    { "agent": "bumblebee", "response": "..." },
    { "agent": "ratchet", "response": "..." }
  ]
}
```

## 🗄️ Database Schema

### Users Table
- Basic user information
- Fitness goals and experience level
- Premium status and expiration

### Workouts Table
- Workout sessions
- Duration and calories burned
- User relationship

### Exercises Table
- Exercise library
- MET values for calorie calculation
- Categories and difficulty levels

### Workout Exercises Table
- Junction table
- Sets, reps, weight tracking
- Exercise-workout relationships

### User Preferences Table
- Language preference
- Theme (light/dark)
- Notification settings

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Premium features require both authentication and active premium subscription.

## 🌟 Premium Features

Premium users get access to:
- Multi-agent AI consultations (Optimus, Bumblebee, Ratchet)
- Personalized weekly workout plans
- Performance analysis with AI insights
- Advanced analytics
- Priority support

## 🔧 Environment Variables

```env
PORT=5000                    # Server port
NODE_ENV=development         # Environment
DATABASE_URL=postgresql://... # Database connection
JWT_SECRET=your-secret       # JWT signing key
JWT_EXPIRE=7d                # Token expiration
GROQ_API_KEY=gsk_...        # Groq API key
CORS_ORIGIN=http://...       # Frontend URL
```

## 📝 Development

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
npm run dev

# Run in production mode
npm start
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

## 📚 API Documentation

Full API documentation with request/response examples coming soon with Swagger/OpenAPI integration.

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the repository owner.

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Related Projects

- **Frontend**: `../frontend` - React 18 web application
- **Mobile**: Coming soon - React Native iOS/Android apps

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: VitorDeus

---

**Built with 💪 by VitorDeus**
