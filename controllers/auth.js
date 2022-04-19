const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')
const { RowDescriptionMessage } = require('pg-protocol/dist/messages')
const { ResultWithContext } = require('express-validator/src/chain')

exports.getUsers = async (req, res) => {
    try {
        const { rows } = await db.query('select id, email from users')
        return res.status(200).json({
            success: true,
            users: rows
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            error: err.message
        })
    }
}

exports.register = async (req, res) => {
    const {email,password} = req.body
    try {
        await db.query('insert into users(email, password) values ($1, $2)', [email, password])
        return res.status(201).json({
            success: true,
            message: 'The registration was successful'
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            error: err.message
        })
    }
}

exports.login = async (req,res) => {
    let user = req.user
    let payload = {
        id: user.id,
        email: user.email
    }
    try {
        const token = await sign(payload, SECRET)
        return res.status(200).cookie('token', token, {httpOnly: true}).json({
           success: true,
           message: "Logged in successfully.",
           id: user.id,
           email: user.email
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        })
    }
}

exports.protected = async (req, res) => {
    try {
        return res.status(200).json({
            info: 'protected info'
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            error: err.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
        return res.status(200).clearCookie('token', { httpOnly: true }).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        })
    }
}



