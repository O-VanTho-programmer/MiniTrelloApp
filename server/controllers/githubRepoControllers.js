const { create } = require("../models/Board");
const GithubAttachment = require("../models/GithubAttachment");
const getGithubAPI = require("../services/githubAPI");

exports.getRepository = async (req, res) => {
    try {
        const { repositoryId } = req.params;
        const octokit = await getGithubAPI(req.user.id);

        const { data } = await octokit.request("GET /repositories/{id}", {
            id: repositoryId
        });

        // console.log(data);

        const owner = data.owner.login;
        const repo = data.name;

        const [branches, pulls, issues, commits] = await Promise.all([
            octokit.rest.repos.listBranches({ owner, repo }),
            octokit.rest.pulls.list({ owner, repo, state: 'open', per_page: 5 }),
            octokit.rest.issues.listForRepo({ owner, repo, state: 'open', per_page: 5 }),
            octokit.rest.repos.listCommits({ owner, repo, per_page: 5 })
        ]);

        const resDto = {
            repositoryId: repositoryId,
            repoName: repo,
            owner: owner,
            branches: branches.data.map(b => ({
                name: b.name,
                lastCommitSha: b.commit.sha,
                url: `https://github.com/${owner}/${repo}/tree/${b.name}`
            })),
            pulls: pulls.data.map(p => ({
                title: p.title,
                pullNumber: p.number,
                url: p.html_url
            })),
            issues: issues.data
                .filter(issue => !issue.pull_request)
                .map(issue => ({
                    title: issue.title,
                    issueNumber: issue.number,
                    url: issue.html_url
                })),
            commits: commits.data.map(commit => ({
                sha: commit.sha,
                message: commit.commit.message,
                url: commit.html_url
            }))
        };

        res.status(200).json(resDto);
    } catch (error) {
        console.error("Get Repo Error:", error.message);
        res.status(500).json({ error: "Failed to fetch repository" });
    }
}

exports.getRepositories = async (req, res) => {
    try {
        const userId = req.user.id;
        const octokit = await getGithubAPI(userId);

        const response = await octokit.rest.repos.listForAuthenticatedUser({
            visibility: 'all',
            sort: 'updated',
            per_page: 100
        });

        const repositories = response.data.map(repo => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            htmlUrl: repo.html_url,
            private: repo.private
        }));

        res.status(200).json(repositories);
    } catch (error) {
        console.error("Get Repos Error:", error.message);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
};

exports.attachGithub = async (req, res) => {
    try {
        const { type, url, title } = req.body;
        const { taskId } = req.params

        const newAttachment = await GithubAttachment.create(taskId, title, type, url);

        res.status(201).json(newAttachment);
    } catch (error) {
        console.error("Attach Github Error:", error.message);
        res.status(500).json({ error: "Failed to attach Github" });
    }
}

exports.getGithubAttachments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const attachments = await GithubAttachment.getAllByTaskId(taskId);

        res.status(200).json(attachments);
    } catch (error) {
        console.error("Get Github Attachments Error:", error.message);
        res.status(500).json({ error: "Failed to get Github Attachments" });
    }
}

exports.deleteGithubAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;
        await GithubAttachment.delete(attachmentId);

        res.status(204).json();
    } catch (error) {
        console.error("Delete Github Attachment Error:", error.message);
        res.status(500).json({ error: "Failed to delete Github Attachment" });
    }
}