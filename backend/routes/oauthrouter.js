const express = require('express');
const passport = require('../utils/passport');
const oauthRouter = express.Router();

// The frontend origin — in dev this is Vite's port (5173), in prod same origin
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

// ── Google ───────────────────────────────────────────────────────────────────
oauthRouter.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

oauthRouter.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND}/login?error=google_failed` }),
  (req, res) => {
    const { token } = req.user;
    // Redirect to frontend with token in URL hash — frontend reads & stores it
    res.redirect(`${FRONTEND}/oauth-callback?token=${token}`);
  }
);

// ── GitHub ───────────────────────────────────────────────────────────────────
oauthRouter.get(
  '/api/auth/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

oauthRouter.get(
  '/api/auth/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND}/login?error=github_failed` }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`${FRONTEND}/oauth-callback?token=${token}`);
  }
);

exports.oauthRouter = oauthRouter;
