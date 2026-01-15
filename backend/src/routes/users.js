import express from 'express';
import { protect } from '../middleware/auth.js';
import { query } from '../config/database.js';
import bcrypt from 'bcrypt';
import { apiRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

// Apply rate limiting to all user routes
router.use(apiRateLimit);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const userResult = await query(
      `SELECT id, email, name, age, weight, height, fitness_goal, experience_level, is_premium, premium_expires_at, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Get preferences
    const prefsResult = await query(
      `SELECT language, theme, notifications_enabled, email_notifications, workout_reminders
       FROM user_preferences WHERE user_id = $1`,
      [req.user.id]
    );

    const preferences = prefsResult.rows[0] || {};

    res.json({
      success: true,
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
          premiumExpiresAt: user.premium_expires_at,
          createdAt: user.created_at
        },
        preferences
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, age, weight, height, fitnessGoal, experienceLevel } = req.body;

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           age = COALESCE($2, age),
           weight = COALESCE($3, weight),
           height = COALESCE($4, height),
           fitness_goal = COALESCE($5, fitness_goal),
           experience_level = COALESCE($6, experience_level),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, email, name, age, weight, height, fitness_goal, experience_level, is_premium`,
      [name, age, weight, height, fitnessGoal, experienceLevel, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

/**
 * @route   PUT /api/users/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/preferences', protect, async (req, res) => {
  try {
    const { language, theme, notificationsEnabled, emailNotifications, workoutReminders } = req.body;

    const result = await query(
      `INSERT INTO user_preferences (user_id, language, theme, notifications_enabled, email_notifications, workout_reminders)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         language = COALESCE($2, user_preferences.language),
         theme = COALESCE($3, user_preferences.theme),
         notifications_enabled = COALESCE($4, user_preferences.notifications_enabled),
         email_notifications = COALESCE($5, user_preferences.email_notifications),
         workout_reminders = COALESCE($6, user_preferences.workout_reminders),
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [req.user.id, language, theme, notificationsEnabled, emailNotifications, workoutReminders]
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
});

/**
 * @route   PUT /api/users/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Get current password hash
    const userResult = await query(
      'SELECT password FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = userResult.rows[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
});

export default router;
