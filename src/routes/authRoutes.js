
const express = require("express");
const { login, register, logout, token } = require("../controllers/auth");
const authenticateJWT = require("../utils/authMiddleware");
const router = express.Router();

router.post('/login', login )
router.post('register', register)
router.post('/logout' , authenticateJWT, logout)
router.post('/token' , authenticateJWT, token)

module.exports = router;
