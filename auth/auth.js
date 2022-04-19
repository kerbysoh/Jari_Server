const { check } = require('express-validator')
const db = require("../db")

const password = check('password').isLength({ min: 6, max: 15 }).withMessage('Password has to be between 6 and 15 characters')

const email = check('email').isEmail().withMessage('Please provide a valid email.')

const emailExists = check('email').custom(async (value) => {
    const { rows } = await db.query('SELECT * from users where email = $1', 
      [value]
    )

    if (rows.length) {
        throw new Error('Email already exists.')
    }
})

const loginFieldsCheck = check('email').custom(async (value, { req }) => {
    const user = await db.query('SELECT * from users WHERE email = $1', [value])
    if (!user.rows.length) {
        throw new Error('Email does not exist.')
    }

    const validPassword = req.body.password == user.rows[0].password

    if (!validPassword) {
        throw new Error('Password is wrong.')
    }
    req.user = user.rows[0]
})

module.exports = {
    registerValidation: [email, password, emailExists],
    loginValidation: [loginFieldsCheck]
}