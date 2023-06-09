const userModel = require("../Models/Users");
const bcrypt = require('bcrypt')

const controller = require('./AuthController');
const express = require("express");
const secretKey = '2023';
const jwt = require('jsonwebtoken');
const jwtAuth = require('../Middleware/jwtAuth');
const router = express.Router();


//Signup Api
exports.signup = async (req, res) => {
    const {username, email, role, password, name} = req.body;
    if (!email || !role || !password || !username) {
        return res.status(200).json({"message": "email,name,role & password is mandatory"})
    }
    console.log("signup body " + username, email, password)
    try {
        const username = email;
        const existingUser = await userModel.findOne({email: email})
        console.log("existingUser ", existingUser)
        if (existingUser != null) {
            return res.status(400).json({message: "username or email already taken"});
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword)
            const result = await userModel.create({
                name: name,
                email: email,
                password: hashedPassword,
                username: username,
                role: role
            });
            return res.status(200).json({message: "Signup successful"})
        }
    } catch (error) {
        console.log(error);
    }
}

//Login API with Jwt
exports.signin = async (req, res) => {
    const {username, password} = req.body;
    const existingUser = await userModel.findOne({username: username})
    if (existingUser) {
        const matchPassword = await bcrypt.compare(password, existingUser.password)

        console.log("match password " + matchPassword.toString())
        if (matchPassword) {
            const user = existingUser.username;
            const role = existingUser.role;
            const token = jwt.sign({userId: user, role: role}, secretKey);
            console.log("Tken....")
            console.log(token)
            return res.status(200).json({token: `${token}`, "role": role, message: "Login Successful"})
        } else {
            return res.status(400).json({message: "invalid credentials"});

        }
    } else {
        return res.status(400).json({message: "user not found"})
    }
};

exports.test = (req, res) => {
    console.log("entered test api")
    return res.send("entered test api");
}

// module.exports = router;
