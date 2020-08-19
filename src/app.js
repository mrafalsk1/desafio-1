const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const project = {
    id:uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(project)
  return response.json(project)
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const {title, url, techs} = request.body
    const repositoryIndex = repositories.findIndex(repository => repository.id == id)
    if(repositoryIndex < 0) {
      return response.status(400).json({error: "Repository not Found"});
    }
    const repository = {
      id,
      title,
      url,
      techs,
      likes
    }
    repositories[repositoryIndex] = repository;
    return response.status(200).json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id)
  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not Found"});
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id) 
  if(!repository) {
    return response.status(400).json({error: "Repository not Found"});
  }
  repository.likes++
  return response.json(repository)
});

module.exports = app;
