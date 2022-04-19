const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")
const cookieParser = require('cookie-parser')
const passport = require('passport')

require('./middleware/passport-middleware')

const { getUsers, register, login, protected, logout } = require("./controllers/auth")
const { registerValidation, loginValidation } = require("./auth/auth")
const { validationMiddleware } = require("./middleware/validation-middleware")
const { CLIENT_URL } = require("./constants")
const { userAuth } = require("./middleware/auth-middleware")

app.use(cors({origin: CLIENT_URL, credentials: true}))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.post("/tasks", userAuth, async (req, res) => {
    try {
        const { description, deadline, status, category, userid } = req.body
        const newTask = await pool
        .query("INSERT INTO tasks (description, deadline, status, category, userid) VALUES ($1, $2, $3, $4, $5);" , [description, deadline, status, category, userid])
        res.json(newTask)
    } catch (err) {
        res.json(err)
    }
})

app.put("/edit-task", userAuth, async (req, res) => {
    try {
        const { task, id } = req.body
        const newTask = await pool
        .query("UPDATE tasks SET description = $1, deadline = $2, status = $3, category = $4, userid = $5 WHERE id = $6;" , [task.description, task.deadline, task.status, task.category, task.userid, id])
        res.json(newTask)
    } catch (err) {
        res.json(err)
    }
})

app.get("/get-tasks", userAuth, async (req, res) => {
    try {
        const id = req.query.id
        const newTask = await pool
        .query("SELECT * FROM tasks WHERE userid = $1" , [id])      
        return res.json(newTask.rows)
    } catch (err) {
        return res.json(err)
    }
})

app.post("/get-users", userAuth, async (req, res) => {
    try {
        res.json(getUsers)
    } catch (err) {

    }
})

app.put("/start-task", userAuth, async (req, res) => {
    try {
        const { id } = req.body
        const response = await pool.query("UPDATE tasks SET status = 'in progress' WHERE id = $1", [id])
        return res.json(response)
    } catch (err) {
        return res.json(err)
    }
})

app.put("/complete-task", userAuth, async (req, res) => {
    try {
        const { id } = req.body
        const response = await pool.query("UPDATE tasks SET status = 'completed' WHERE id = $1", [id])
        return res.json(response)
    } catch (err) {
        return res.json(err)
    }
})

app.put("/delete-task", userAuth, async (req, res) => {
    try {
        const { id } = req.body
        const response = await pool.query("DELETE FROM tasks WHERE id = $1", [id])
        return res.json(response)
    } catch (err) {
        return res.json(err)
    }
})

app.post('/register', registerValidation, validationMiddleware, register)

app.post("/login", loginValidation, validationMiddleware, login)

app.get('/protected', userAuth, protected)

app.get('/logout', userAuth, logout)

app.listen(5000, () => {
    console.log("Server has started on port 5000")
})

