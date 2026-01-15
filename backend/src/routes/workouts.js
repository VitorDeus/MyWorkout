import express from 'express';
import { protect } from '../middleware/auth.js';
import { query } from '../config/database.js';

const router = express.Router();

/**
 * @route   GET /api/workouts
 * @desc    Get all workouts for logged-in user
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, description, duration, calories_burned, date, created_at
       FROM workouts 
       WHERE user_id = $1 
       ORDER BY date DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workouts'
    });
  }
});

/**
 * @route   POST /api/workouts
 * @desc    Create a new workout
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, duration, caloriesBurned, exercises } = req.body;

    // Create workout
    const workoutResult = await query(
      `INSERT INTO workouts (user_id, name, description, duration, calories_burned)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, duration, calories_burned, date, created_at`,
      [req.user.id, name, description || null, duration || null, caloriesBurned || 0]
    );

    const workout = workoutResult.rows[0];

    // Add exercises if provided
    if (exercises && exercises.length > 0) {
      for (const exercise of exercises) {
        await query(
          `INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight, duration)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [workout.id, exercise.exerciseId || null, exercise.sets || null, exercise.reps || null, exercise.weight || null, exercise.duration || null]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      data: workout
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating workout'
    });
  }
});

/**
 * @route   GET /api/workouts/:id
 * @desc    Get single workout details
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const workoutResult = await query(
      `SELECT id, name, description, duration, calories_burned, date, created_at
       FROM workouts 
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (workoutResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    const workout = workoutResult.rows[0];

    // Get exercises for this workout
    const exercisesResult = await query(
      `SELECT id, exercise_id, sets, reps, weight, duration
       FROM workout_exercises
       WHERE workout_id = $1`,
      [workout.id]
    );

    workout.exercises = exercisesResult.rows;

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workout'
    });
  }
});

/**
 * @route   DELETE /api/workouts/:id
 * @desc    Delete a workout
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await query(
      `DELETE FROM workouts 
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting workout'
    });
  }
});

/**
 * @route   GET /api/workouts/stats/summary
 * @desc    Get workout statistics for user
 * @access  Private
 */
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const result = await query(
      `SELECT 
         COUNT(*) as total_workouts,
         SUM(calories_burned) as total_calories,
         SUM(duration) as total_duration,
         AVG(calories_burned) as avg_calories_per_workout
       FROM workouts
       WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

export default router;
