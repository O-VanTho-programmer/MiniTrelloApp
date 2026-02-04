const axios = require('axios');
const jwt = require('jsonwebtoken');
const { db } = require('../configs/db');

exports.githubLogin = async (req, res) => {
    try {
        const { code } = req.body;

        const respone = await axios.post("https://github.com/login/oauth/access_token", {
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
            id: gitHubUser.id,
            name: gitHubUser.name,
            email: gitHubUser.email,
            avatar: gitHubUser.avatar_url,
        }

        const token = jwt.sign(
            userData,
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        )

        return res.status(200).json({ message: "Login successfully", token, user: userData })

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
            id: googleUser.sub,
            name: googleUser.name,
            email: googleUser.email,
            avatar: googleUser.picture,
        }

        const token = jwt.sign(
            userData,
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        )

        return res.status(200).json({ message: "Login successfully", token, user: userData })

    } catch (error) {
        console.error("Error login with Google", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}