const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const getRepoIndex = (id) => repositories.findIndex((repo) => repo.id === id);
const noRepoError = (response) => {
  return response.status(400).json({ error: "Repository not found." });
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const new_repo = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };

  repositories.push(new_repo);

  return response.json(new_repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = getRepoIndex(id);

  if (repoIndex < 0) return noRepoError(response);

  const repo = repositories[repoIndex];
  if (title) repo.title = title;
  if (url) repo.url = url;
  if (techs) repo.techs = techs;

  repositories[repoIndex] = repo;

  return response.status(200).json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = getRepoIndex(id);

  if (repoIndex < 0) return noRepoError(response);

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = getRepoIndex(id);

  if (repoIndex < 0) return noRepoError(response);

  repositories[repoIndex].likes++;

  return response.status(200).json(repositories[repoIndex]);
});

module.exports = app;
