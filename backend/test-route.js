const express = require('express');
const router = express.Router();
console.log('Before require...');
const { register, login } = require('./controller/authController');
console.log('After require...');
console.log('register:', typeof register);
console.log('login:', typeof login);

router.post('/register', register);
router.post('/login', login);
console.log('Routes set up successfully');