import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Middleware to check if user has premium subscription
 */
export const premiumRequired = async (req, res, next) => {
  try {
    // Import query function dynamically to avoid circular dependency
    const { query } = await import('../config/database.js');
    
    // Fetch user's premium status from database
    const result = await query(
      'SELECT is_premium, premium_expires_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    // Check if user has active premium subscription
    if (!user.is_premium) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required for this feature'
      });
    }

    // Check if premium has expired
    if (user.premium_expires_at && new Date(user.premium_expires_at) < new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription has expired. Please renew to continue.'
      });
    }

    // Attach premium status to request for downstream use
    req.user.isPremium = true;
    req.user.premiumExpiresAt = user.premium_expires_at;

    next();
  } catch (error) {
    console.error('Premium verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying premium status'
    });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
