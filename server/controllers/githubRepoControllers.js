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
                lastCommitSha: b.commit.sha
            })),
            pulls: pulls.data.map(p => ({
                title: p.title,
                pullNumber: p.number,
                url: p.html_url
            })),
            issues: issues.data
                .filter(i => !i.pull_request)
                .map(i => ({
                    title: i.title,
                    issueNumber: i.number,
                    url: i.html_url
                })),
            commits: commits.data.map(c => ({
                sha: c.sha,
                message: c.commit.message
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