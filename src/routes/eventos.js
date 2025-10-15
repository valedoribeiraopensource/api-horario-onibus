const express = require('express');
const router = express.Router();
const eventos = require('../data/eventos.json');

// Todos os eventos
router.get('/', (req, res) => res.json(eventos.eventos));

// Buscar por nome
router.get('/buscar', (req, res) => {
  const { nome } = req.query;
  if (!nome) return res.status(400).json({ error: 'Informe o parâmetro nome' });

  const resultado = [];
  Object.values(eventos.eventos).forEach(mes => {
    mes.forEach(ev => {
      if (ev.nome.toLowerCase().includes(nome.toLowerCase())) resultado.push(ev);
    });
  });
  res.json(resultado);
});

module.exports = router;
