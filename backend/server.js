require("dotenv").config();
// Triggering nodemon reload to pick up new .env configuration
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const session = require("express-session");

// Passport (must be required AFTER dotenv)
const passport = require("./utils/passport");

const { homeRouter  } = require('./routes/homerouter');
const { oauthRouter } = require('./routes/oauthrouter');
require('./cron/updateAqi');

const dbpath = process.env.MONGO_URI;
const app    = express();
const port   = process.env.PORT || 3000;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session needed by Passport internals even though we use JWT
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }   // set to true in production with HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/", apiLimiter);

app.use(homeRouter);
app.use(oauthRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: "404 page not found" });
});

mongoose.connect(dbpath).then(() => {
  console.log("connected to mongodb");
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}).catch(err => {
  console.log("failed to connect to mongodb", err);
});