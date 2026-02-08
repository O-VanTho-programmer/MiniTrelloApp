const User = require("../models/User");
const { Octokit } = require("@octokit/rest");

const getGithubAPI = async (userId) => {
    try {
        const user = User.getById(userId);

        const token = user.github_access_token;

        if (!token) throw new Error("No token");

        const octoki = new Octokit({
            auth: token
        })

        return octoki;
    } catch (error) {
        console.error("Error get github api", error);
    }
}