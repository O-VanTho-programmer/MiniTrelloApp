const User = require("../models/User");

const getGithubAPI = async (userId) => {
    try {
        const { Octokit } = await import("@octokit/rest");
        const user = await User.getById(userId);

        if (!user) throw new Error("User not found");

        const token = user.github_access_token;

        if (!token) throw new Error("No GitHub token found for this user");

        const octokit = new Octokit({
            auth: token
        });

        return octokit;
    } catch (error) {
        console.error("Error getting GitHub API client:", error.message);
        throw error;
    }
}

module.exports = getGithubAPI;