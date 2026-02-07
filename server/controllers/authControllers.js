const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const AuthCode = require('../models/AuthCode');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

module.exports.transporter = transporter;

exports.githubLogin = async (req, res) => {
    try {
        const { code } = req.body;

        const respone = await axios.post("https://github.com/login/oauth/access_token", {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, {
            headers: {
                "Accept": "application/json"
            }
        })

        const access_token = respone.data.access_token;

        if (!access_token) {
            return res.status(400).json({ error: "Error with getting access token from GitHub" });
        }

        const user = await axios.get("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })

        const gitHubUser = user.data;

        const userData = {
            id: String(gitHubUser.id),
            name: gitHubUser.name,
            email: gitHubUser.email,
            avatar_url: gitHubUser.avatar_url,
            provider: "github"
        }

        const token = jwt.sign(
            {
                id: userData.id,
                email: userData.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        )

        const savedUser = await User.createOrUpdate(userData);

        return res.status(200).json({ message: "Login successfully", token, user: savedUser })

    } catch (error) {
        console.error("Error login with GitHub", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.googleLogin = async (req, res) => {
    try {
        const { code } = req.body;

        const getToken = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:3000/auth/google/callback",
            grant_type: "authorization_code"
        });

        const { access_token } = getToken.data;

        if (!access_token) {
            return res.status(400).json({ error: "Error with getting access token from Google" });
        }

        const user = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });

        const googleUser = user.data;

        console.log(googleUser);

        const userData = {
            id: String(googleUser.id),
            name: googleUser.name,
            email: googleUser.email,
            avatar_url: googleUser.picture,
            provider: "google"
        }

        const token = jwt.sign(
            {
                id: userData.id,
                email: userData.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        )

        const savedUser = await User.createOrUpdate(userData);

        return res.status(200).json({ message: "Login successfully", token, user: savedUser })

    } catch (error) {
        console.error("Error login with Google", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.sendCode = async (req, res) => {
    const { email } = req.body;

    const existUser = await User.getByEmail(email);

    if (existUser) {
        res.status(401).json({ error: "User already exists" });
        return;
    }

    const code = Math.floor(Math.random() * 90000) + 10000;;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Email",
        text: `Your verification code is: ${code}`
    })

    const newAuthCode = await AuthCode.create(email, code);
    res.status(201).json(newAuthCode);
}

exports.signUp = async (req, res) => {
    try {
        const { name, email, code } = req.body;

        const authCode = await AuthCode.verify(email, Number(code));

        if (!authCode) {
            return res.status(401).json({ error: "Invalid code" });
        }

        const newUser = await User.create(name, email);

        const userData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar_url: newUser.avatar_url,
            provider: newUser.provider
        }

        const token = jwt.sign(
            {
                id: userData.id,
                email: userData.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        )

        res.status(201).json({ message: "Sign up successfully", token, user: newUser });
    } catch (error) {
        console.error("Error sign up", error.message);
        res.status(500).json({ error: "Error sign up" });
    }
}

exports.signIn = async (req, res) => {
    try {
        const { email, code } = req.body;

        const authCode = await AuthCode.verify(email, Number(code));

        if (!authCode) {
            return res.status(401).json({ error: "Invalid code" });
        }

        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar_url: user.avatar_url,
            provider: user.provider
        }

        const token = jwt.sign(
            {
                id: userData.id,
                email: userData.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        )

        res.status(200).json({ message: "Sign in successfully", token, user: userData });
    } catch (error) {
        console.error("Error sign in", error.message);
        res.status(500).json({ error: "Error sign in" });
    }
}