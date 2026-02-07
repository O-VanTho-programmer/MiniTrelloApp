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