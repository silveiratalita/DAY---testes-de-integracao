const express = require('express');
const app = express();

let orders = [];

// Rota para criar um novo pedido
app.post('/orders', (req, res) => {
  const { products } = req.body;

  const newOrder = { id: orders.length + 1, products, status: 'Pendente' };
  orders.push(newOrder);

  res.status(201).json(newOrder);
});

// Rota para obter um pedido específico pelo ID
app.get('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  const order = orders.find((o) => o.id === parseInt(orderId));
  if (!order) {
    return res.sendStatus(404);
  }

  res.json(order);
});

// Rota para atualizar o status de um pedido
app.put('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const order = orders.find((o) => o.id === parseInt(orderId));
  if (!order) {
    return res.sendStatus(404);
  }

  order.status = status;

  res.json(order);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
