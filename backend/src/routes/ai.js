import express from 'express';
import { protect, premiumRequired } from '../middleware/auth.js';
import specializedAgents from '../services/specializedAgents.js';
import { query } from '../config/database.js';
import { aiRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

// Apply AI-specific rate limiting to all routes
router.use(aiRateLimit);

/**
 * @route   POST /api/ai/advice
 * @desc    Get specialized AI advice - automatically routes to relevant expert agents
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
      'SELECT weight, height, fitness_goal, experience_level, age, gender FROM users WHERE id = $1',
      [req.user.id]
    );

    const userData = userResult.rows[0];

    // Get workout history
    const workoutHistory = await query(
      'SELECT id, name, date, calories_burned FROM workouts WHERE user_id = $1 ORDER BY date DESC LIMIT 10',
      [req.user.id]
    );

    // Get workout statistics
    const statsResult = await query(
      `SELECT 
         COUNT(*) as total_workouts,
         SUM(calories_burned) as total_calories
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
      age: userData.age || 30,
      gender: userData.gender || 'male',
      fitnessGoal: userData.fitness_goal || 'General Fitness',
      experienceLevel: userData.experience_level || 'Beginner',
      workoutHistory: workoutHistory.rows
    };

    const workoutData = {
      totalWorkouts: parseInt(stats.total_workouts) || 0,
      totalCalories: parseInt(stats.total_calories) || 0,
      weeklyFrequency: 4,
      lastWeekWorkouts: parseInt(lastWeekResult.rows[0].last_week_workouts) || 0
    };

    // Intelligent routing to specialized agents
    const advice = await specializedAgents.routeQuestion(userContext, question, workoutData);

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
 * @desc    Generate personalized weekly workout plan using Personal Trainer Agent
 * @access  Private + Premium
 */
router.post('/weekly-plan', protect, premiumRequired, async (req, res) => {
  try {
    const { availableDays } = req.body;

    // Get user data
    const userResult = await query(
      'SELECT weight, height, fitness_goal, experience_level, age, gender FROM users WHERE id = $1',
      [req.user.id]
    );

    const userData = userResult.rows[0];

    // Get workout history
    const workoutHistory = await query(
      'SELECT id, name, date FROM workouts WHERE user_id = $1 ORDER BY date DESC LIMIT 10',
      [req.user.id]
    );

    const userContext = {
      weight: userData.weight || 70,
      height: userData.height || 175,
      age: userData.age || 30,
      gender: userData.gender || 'male',
      fitnessGoal: userData.fitness_goal || 'General Fitness',
      experienceLevel: userData.experience_level || 'Beginner',
      availableDays: availableDays || 4,
      workoutHistory: workoutHistory.rows
    };

    const question = `Crie um plano de treino semanal completo para ${availableDays || 4} dias por semana. Inclua:
1. Divisão dos treinos
2. Exercícios específicos com séries e repetições
3. Progressão sugerida
4. Tempo de descanso entre séries
5. Dicas de execução`;

    // Use Personal Trainer Agent for workout programming
    const plan = await specializedAgents.personalTrainerAgent(userContext, question);

    res.json({
      success: true,
      data: {
        plan: plan.response,
        agent: plan.agent,
        icon: plan.icon,
        timestamp: new Date().toISOString()
      }
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
 * @desc    Analyze user's workout performance using Performance Analyst Agent
 * @access  Private + Premium
 */
router.get('/performance-analysis', protect, premiumRequired, async (req, res) => {
  try {
    // Get user data
    const userResult = await query(
      'SELECT weight, height, fitness_goal, experience_level, age, gender FROM users WHERE id = $1',
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
      age: userData.age || 30,
      gender: userData.gender || 'male',
      fitnessGoal: userData.fitness_goal || 'General Fitness',
      experienceLevel: userData.experience_level || 'Beginner'
    };

    const workoutData = {
      totalWorkouts: parseInt(stats.total_workouts) || 0,
      totalCalories: parseInt(stats.total_calories) || 0,
      avgCalories: parseInt(stats.avg_calories) || 0,
      weeklyFrequency: 4,
      lastWeekWorkouts: parseInt(lastWeekResult.rows[0].last_week_workouts) || 0
    };

    const question = `Analise meu desempenho completo nos treinos. Forneça:
1. Avaliação do progresso geral
2. Pontos fortes identificados
3. Áreas que precisam melhorar
4. Recomendações específicas baseadas nos dados
5. Ajustes sugeridos no plano de treino`;

    // Use Performance Analyst Agent
    const analysis = await specializedAgents.performanceAnalystAgent(userContext, question, workoutData);

    res.json({
      success: true,
      data: {
        analysis: analysis.response,
        agent: analysis.agent,
        icon: analysis.icon,
        statistics: workoutData,
        timestamp: new Date().toISOString()
      }
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
 * @desc    Ask a simple fitness question (free tier) - uses Personal Trainer Agent
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

    // Get user data
    const userResult = await query(
      'SELECT weight, height, fitness_goal, experience_level, age, gender FROM users WHERE id = $1',
      [req.user.id]
    );

    const userData = userResult.rows[0];

    const userContext = {
      weight: userData.weight || 70,
      height: userData.height || 175,
      age: userData.age || 30,
      gender: userData.gender || 'male',
      fitnessGoal: userData.fitness_goal || 'General Fitness',
      experienceLevel: userData.experience_level || 'Beginner',
      workoutHistory: []
    };

    // Use Personal Trainer Agent for free tier questions
    const answer = await specializedAgents.personalTrainerAgent(userContext, question);

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

/**
 * @route   POST /api/ai/comprehensive
 * @desc    Get comprehensive consultation from multiple specialized agents
 * @access  Private + Premium
 */
router.post('/comprehensive', protect, premiumRequired, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }

    // Get user data
    const userResult = await query(
      'SELECT weight, height, fitness_goal, experience_level, age, gender FROM users WHERE id = $1',
      [req.user.id]
    );

    const userData = userResult.rows[0];

    // Get workout statistics
    const statsResult = await query(
      `SELECT 
         COUNT(*) as total_workouts,
         SUM(calories_burned) as total_calories
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
      age: userData.age || 30,
      gender: userData.gender || 'male',
      fitnessGoal: userData.fitness_goal || 'General Fitness',
      experienceLevel: userData.experience_level || 'Beginner',
      workoutHistory: []
    };

    const workoutData = {
      totalWorkouts: parseInt(stats.total_workouts) || 0,
      totalCalories: parseInt(stats.total_calories) || 0,
      weeklyFrequency: 4,
      lastWeekWorkouts: parseInt(lastWeekResult.rows[0].last_week_workouts) || 0
    };

    // Get comprehensive consultation from top 3 agents
    const consultation = await specializedAgents.comprehensiveConsultation(userContext, question, workoutData);

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Comprehensive consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating comprehensive consultation'
    });
  }
});

export default router;
