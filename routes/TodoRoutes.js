const express = require('express')

const {login, logout, updateTodo, deleteTodo, getTodo, createTodo, isAuthenticatedUser } = require('../controllers/todo.controller');

const { verifyTokenMiddleware } = require('../Middleware/verifyTokenMiddleware');

const router = express.Router()

// router.post("/refresh", refreshAccessToken);
router.post("/login", login);
router.post("/logout", logout);

router.patch('/updateTodo/:id',verifyTokenMiddleware, updateTodo)
router.delete('/deleteTodo/:id',verifyTokenMiddleware, deleteTodo)

router.get('/getTodo',verifyTokenMiddleware, getTodo)
router.get('/isAuthenticatedUser', isAuthenticatedUser)

router.post('/createTodo',verifyTokenMiddleware, createTodo)

module.exports = router