const express = require('express');
const app = express();

// Rota para listar todos os usuários
app.get('/users', (req, res) => {
  // Lógica para obter os usuários do banco de dados
  const users = [
      { id: 1, name: 'João' },
      { id: 2, name: 'Joana' },
  ];

  res.json(users);
});

// Rota para obter um usuário específico pelo ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  // Lógica para buscar o usuário pelo ID no banco de dados
    const user = { id: userId, name: 'João' };

  res.json(user);
});

// Rota para criar um novo usuário
app.post('/users', (req, res) => {
  const { name } = req.body;

  // Lógica para criar o novo usuário no banco de dados
  const newUser = { id: 3, name };

  res.status(201).json(newUser);
});

// Rota para atualizar um usuário existente
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name } = req.body;

  // Lógica para atualizar o usuário no banco de dados
  const updatedUser = { id: userId, name };

  res.json(updatedUser);
});

// Rota para excluir um usuário
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  // Lógica para excluir o usuário do banco de dados

  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
