import express from 'express';
import { protect, premiumRequired } from '../middleware/auth.js';
import groqService from '../services/groqService.js';
import { query } from '../config/database.js';

const router = express.Router();

/**
 * @route   POST /api/ai/advice
 * @desc    Get multi-agent AI advice (Optimus, Bumblebee, Ratchet)
 * @access  Private + Premium
 */
router.post('/advice', protect, premiumRequired, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }

    // Get user data for context
    const userResult = await query(
      'SELECT weight, height, fitness_goal, experience_level FROM users WHERE id = $1',
      [req.user.id]
    );

    const userData = userResult.rows[0];

    // Get workout history
    const workoutHistory = await query(
      'SELECT id, name, date, calories_burned FROM workouts WHERE user_id = $1 ORDER BY date DESC LIMIT 10',
      [req.user.id]
    );

    const userContext = {
      weight: userData.weight || 70,
      height: userData.height || 175,
      fitnessGoal: userData.fitness_goal || 'General Fitness',
      experienceLevel: userData.experience_level || 'Beginner',
      workoutHistory: workoutHistory.rows
    };

    // Get multi-agent advice
    const advice = await groqService.getMultiAgentAdvice(userContext, question);

    res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    console.error('AI advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI advice'
    });
  }
});

/**
 * @route   POST /api/ai/weekly-plan
 * @desc    Generate personalized weekly workout plan
 * @access  Private + Premium
 */
router.post('/weekly-plan', protect, premiumRequired, async (req, res) => {
  try {
    const { availableDays } = req.body;

    // Get user data
    const userResult = await query(
      'SELECT weight, height, fitness_goal, experience_level FROM users WHERE id = $1',
      [req.user.id]
    );

    const userData = userResult.rows[0];

    const userContext = {
      weight: userData.weight || 70,
      height: userData.height || 175,
      fitnessGoal: userData.fitness_goal || 'General Fitness',
      experienceLevel: userData.experience_level || 'Beginner',
      availableDays: availableDays || 4
    };

    // Generate plan
    const plan = await groqService.generateWeeklyPlan(userContext);

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Weekly plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating weekly plan'
    });
  }
});

/**
 * @route   GET /api/ai/performance-analysis
 * @desc    Analyze user's workout performance
 * @access  Private + Premium
 */
router.get('/performance-analysis', protect, premiumRequired, async (req, res) => {
  try {
    // Get user data
    const userResult = await query(
      'SELECT weight, height, fitness_goal, experience_level FROM users WHERE id = $1',
      [req.user.id]
    );

    const userData = userResult.rows[0];

    // Get workout statistics
    const statsResult = await query(
      `SELECT 
         COUNT(*) as total_workouts,
         SUM(calories_burned) as total_calories,
         AVG(calories_burned) as avg_calories
       FROM workouts
       WHERE user_id = $1`,
      [req.user.id]
    );

    const stats = statsResult.rows[0];

    // Get last week's workouts
    const lastWeekResult = await query(
      `SELECT COUNT(*) as last_week_workouts
       FROM workouts
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '7 days'`,
      [req.user.id]
    );

    const userContext = {
      weight: userData.weight || 70,
      height: userData.height || 175,
      fitnessGoal: userData.fitness_goal || 'General Fitness',
      experienceLevel: userData.experience_level || 'Beginner'
    };

    const workoutData = {
      totalWorkouts: parseInt(stats.total_workouts) || 0,
      totalCalories: parseInt(stats.total_calories) || 0,
      weeklyFrequency: 4, // Could calculate actual from data
      lastWeekWorkouts: parseInt(lastWeekResult.rows[0].last_week_workouts) || 0
    };

    // Generate analysis
    const analysis = await groqService.analyzePerformance(userContext, workoutData);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Performance analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing performance'
    });
  }
});

/**
 * @route   POST /api/ai/simple-question
 * @desc    Ask a simple fitness question (non-premium)
 * @access  Private
 */
router.post('/simple-question', protect, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }

    // Use Ratchet agent for simple practical advice
    const userResult = await query(
      'SELECT weight, height, fitness_goal, experience_level FROM users WHERE id = $1',
      [req.user.id]
    );

    const userData = userResult.rows[0];

    const userContext = {
      weight: userData.weight || 70,
      height: userData.height || 175,
      fitnessGoal: userData.fitness_goal || 'General Fitness',
      experienceLevel: userData.experience_level || 'Beginner',
      workoutHistory: []
    };

    const answer = await groqService.ratchetAnalysis(userContext, question);

    res.json({
      success: true,
      data: answer
    });
  } catch (error) {
    console.error('Simple question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error answering question'
    });
  }
});

export default router;
