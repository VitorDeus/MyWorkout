import express from 'express';
import bcrypt from 'bcrypt';
import { query } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';
import { authRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const { email, password, name, age, weight, height, fitnessGoal, experienceLevel } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and name'
      });
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password, name, age, weight, height, fitness_goal, experience_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, name, age, weight, height, fitness_goal, experience_level, is_premium, created_at`,
      [email, hashedPassword, name, age || null, weight || null, height || null, fitnessGoal || null, experienceLevel || null]
    );

    const user = result.rows[0];

    // Create default preferences
    await query(
      `INSERT INTO user_preferences (user_id, language, theme)
       VALUES ($1, 'pt', 'light')`,
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          age: user.age,
          weight: user.weight,
          height: user.height,
          fitnessGoal: user.fitness_goal,
          experienceLevel: user.experience_level,
          isPremium: user.is_premium
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const result = await query(
      `SELECT id, email, password, name, age, weight, height, fitness_goal, experience_level, is_premium, premium_expires_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          age: user.age,
          weight: user.weight,
          height: user.height,
          fitnessGoal: user.fitness_goal,
          experienceLevel: user.experience_level,
          isPremium: user.is_premium,
          premiumExpiresAt: user.premium_expires_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
});

export default router;
