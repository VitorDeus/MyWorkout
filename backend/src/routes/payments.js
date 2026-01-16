import express from 'express';
import Stripe from 'stripe';
import { authRequired } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Stripe checkout session
router.post('/create-checkout-session', authRequired, async (req, res) => {
  try {
    const { priceId, plan } = req.body;
    const userId = req.user.id;

    // Price mapping
    const prices = {
      monthly: { amount: 999, interval: 'month', name: 'Monthly Premium' },
      annual: { amount: 7999, interval: 'year', name: 'Annual Premium' },
      lifetime: { amount: 19999, interval: null, name: 'Lifetime Premium' }
    };

    const selectedPrice = prices[plan];
    if (!selectedPrice) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPrice.name,
              description: `MyWorkout ${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
            },
            unit_amount: selectedPrice.amount,
            ...(selectedPrice.interval && {
              recurring: {
                interval: selectedPrice.interval,
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: selectedPrice.interval ? 'subscription' : 'payment',
      success_url: `${process.env.CORS_ORIGIN}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_ORIGIN}/premium`,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        plan: plan,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Verify payment success
router.get('/verify-session/:sessionId', authRequired, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const userId = req.user.id;
      const plan = session.metadata.plan;

      // Calculate expiry date
      let expiryDate = null;
      if (plan === 'monthly') {
        expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (plan === 'annual') {
        expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }
      // lifetime has no expiry

      // Update user premium status
      await pool.query(
        'UPDATE users SET is_premium = true, premium_expires_at = $1, subscription_plan = $2 WHERE id = $3',
        [expiryDate, plan, userId]
      );

      res.json({
        success: true,
        plan: plan,
        expiresAt: expiryDate,
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Failed to verify session' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        if (session.payment_status === 'paid') {
          const userId = parseInt(session.metadata.userId);
          const plan = session.metadata.plan;

          let expiryDate = null;
          if (plan === 'monthly') {
            expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);
          } else if (plan === 'annual') {
            expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          }

          await pool.query(
            'UPDATE users SET is_premium = true, premium_expires_at = $1, subscription_plan = $2 WHERE id = $3',
            [expiryDate, plan, userId]
          );
        }
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const subscription = event.data.object;
        // You would need to store customer_id in your database to handle this
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Get subscription status
router.get('/subscription-status', authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT is_premium, premium_expires_at, subscription_plan FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      isPremium: user.is_premium,
      expiresAt: user.premium_expires_at,
      plan: user.subscription_plan,
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

export default router;
