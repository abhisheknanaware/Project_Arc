const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: find or create OAuth user, return JWT ──────────────────────────
const findOrCreateOAuthUser = async ({ email, name, avatar, provider, providerId }) => {
  let user = await User.findOne({ email });

  if (user) {
    // If found by email but different provider, just update provider info
    if (!user.providerId) {
      user.provider   = provider;
      user.providerId = providerId;
      if (name)   user.name   = name;
      if (avatar) user.avatar = avatar;
      await user.save();
    }
  } else {
    user = await User.create({ email, name, avatar, provider, providerId });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '7d' }
  );

  return { user, token };
};

// ── Google Strategy ─────────────────────────────────────────────────────────
const BACKEND_URL = `http://localhost:${process.env.PORT || 3002}`;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email  = profile.emails?.[0]?.value;
        const name   = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        if (!email) return done(new Error('No email from Google'), null);

        const { token } = await findOrCreateOAuthUser({
          email, name, avatar,
          provider: 'google',
          providerId: profile.id,
        });

        done(null, { token });
      } catch (err) {
        done(err, null);
      }
    }
  ));
} else {
  console.warn("WARNING: Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) not configured. Google login will be disabled.");
}

// ── GitHub Strategy ─────────────────────────────────────────────────────────
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy(
    {
      clientID:     process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:  `${BACKEND_URL}/api/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email  = profile.emails?.[0]?.value;
        const name   = profile.displayName || profile.username;
        const avatar = profile.photos?.[0]?.value;

        if (!email) return done(new Error('No email from GitHub. Make sure your GitHub email is public or grant email scope.'), null);

        const { token } = await findOrCreateOAuthUser({
          email, name, avatar,
          provider: 'github',
          providerId: String(profile.id),
        });

        done(null, { token });
      } catch (err) {
        done(err, null);
      }
    }
  ));
} else {
  console.warn("WARNING: GitHub OAuth credentials (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET) not configured. GitHub login will be disabled.");
}

// Passport needs these even though we're using JWTs (not sessions)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
