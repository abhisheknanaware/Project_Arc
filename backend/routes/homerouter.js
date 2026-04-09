const express = require('express');
const homerouter = express.Router();

const  homecontroller= require('../controllers/homecontroller');

homerouter.post('/api/login',homecontroller.postlogin);
homerouter.get('/api/data',homecontroller.getapidata);
homerouter.post('/api/contact/postrequest',homecontroller.postreqdata);

exports.homeRouter = homerouter;