const express = require('express');
const app = express();

let tasks = [];

// Rota para listar todas as tarefas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Rota para criar uma nova tarefa
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Rota para atualizar o status de uma tarefa
app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;

  const task = tasks.find((t) => t.id === parseInt(taskId));
  if (!task) {
    return res.sendStatus(404);
  }

  task.completed = completed;

  res.json(task);
});

// Rota para excluir uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  tasks = tasks.filter((t) => t.id !== parseInt(taskId));

  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
