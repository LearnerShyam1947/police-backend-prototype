const verifyToken = require('../middleware/AuthMiddleware');
const {
    login,
    changePassword
} = require("./../controllers/AuthController");
const express = require('express');

const authRouter = express.Router();

// Login route to authenticate the user and generate JWT token
authRouter.post('/login', login);

// Change password route (secured with verifyToken middleware)
authRouter.post('/change-password', verifyToken, changePassword);

module.exports = authRouter;