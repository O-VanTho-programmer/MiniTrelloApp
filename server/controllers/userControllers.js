const User = require("../models/User");

exports.getUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const currentUser = await User.getById(userId);
        res.status(200).json(currentUser);
    } catch (error) {
        console.error("Error get user", error);
        res.status(500).json({ error: "Error get user" });
    }
}

exports.getUserByEmailSearch = async (req, res) =>{
    try {
        const {email} = req.query;

        const users = await User.getByEmailSearch(email);

        res.status(200).json(users);
    } catch (error) {
        console.error("Error search user by email", error);
        res.status(500).json({ error: "Error search user by email" });
    }
}