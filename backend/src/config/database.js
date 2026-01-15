import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Query helper function
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // Log query without sensitive parameters
    const queryType = text.trim().split(' ')[0].toUpperCase();
    console.log(`Executed ${queryType} query`, { duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        gender VARCHAR(10) DEFAULT 'male',
        weight DECIMAL,
        height DECIMAL,
        fitness_goal VARCHAR(100),
        experience_level VARCHAR(50),
        is_premium BOOLEAN DEFAULT FALSE,
        premium_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Workouts table
    await query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        duration INTEGER,
        calories_burned INTEGER,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Exercises table
    await query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        difficulty VARCHAR(50),
        equipment VARCHAR(255),
        met_value DECIMAL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Workout exercises junction table
    await query(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id SERIAL PRIMARY KEY,
        workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
        exercise_id INTEGER,
        sets INTEGER,
        reps INTEGER,
        weight DECIMAL,
        duration INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User preferences table
    await query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        language VARCHAR(10) DEFAULT 'pt',
        theme VARCHAR(20) DEFAULT 'light',
        notifications_enabled BOOLEAN DEFAULT TRUE,
        email_notifications BOOLEAN DEFAULT TRUE,
        workout_reminders BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export default pool;
