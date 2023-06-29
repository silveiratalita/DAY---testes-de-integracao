const express = require('express');
const app = express();

let posts = [];

// Rota para listar todos os posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// Rota para criar um novo post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;

  const newPost = { id: posts.length + 1, title, content };
  posts.push(newPost);

  res.status(201).json(newPost);
});

// Rota para obter um post específico pelo ID
app.get('/posts/:id', (req, res) => {
  const postId = req.params.id;

  const post = posts.find((p) => p.id === parseInt(postId));
  if (!post) {
    return res.sendStatus(404);
  }

  res.json(post);
});

// Rota para atualizar um post existente
app.put('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  const post = posts.find((p) => p.id === parseInt(postId));
  if (!post) {
    return res.sendStatus(404);
  }

  post.title = title;
  post.content = content;

  res.json(post);
});

// Rota para excluir um post
app.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;

  posts = posts.filter((p) => p.id !== parseInt(postId));

  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
