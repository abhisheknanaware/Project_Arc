const express = require('express');
const homerouter = express.Router();
const homecontroller = require('../controllers/homecontroller');
const auth = require('../utils/auth');

homerouter.post('/api/signup', homecontroller.postSignup);
homerouter.post('/api/login', homecontroller.postlogin);

// Protected routes
homerouter.get('/api/data', auth, homecontroller.getapidata);
homerouter.get('/api/history/:location', auth, homecontroller.gethistory);
homerouter.post('/api/contact/postrequest', auth, homecontroller.postreqdata);

exports.homeRouter = homerouter;