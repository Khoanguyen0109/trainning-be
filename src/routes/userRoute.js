
const express = require("express");
const { getAll , create, getOne, update, remove } = require("../controllers/user");
const { getAllTasks , getOneTask, createTask, updateTask, removeTask } = require("../controllers/task");

const authenticateJWT = require("../utils/authMiddleware");
const adminAuthorization = require('../utils/adminAuthorization')
const router = express.Router();

router.get('/', authenticateJWT, adminAuthorization, getAll )
router.post('/', authenticateJWT, adminAuthorization, create)

router.get('/:id', authenticateJWT, adminAuthorization, getOne)
router.put('/:id' , authenticateJWT ,adminAuthorization,  update )
router.delete('/id' , authenticateJWT, adminAuthorization, remove)





module.exports = router;
