const express = require('express');
const router = express.Router();
const estabelecimentos = require('../data/estabelecimentos.json');

// Listar por categoria
router.get('/bares', (req, res) => res.json(estabelecimentos.bares_lanchonetes_pizzarias_chopperias));
router.get('/sorveterias', (req, res) => res.json(estabelecimentos.sorveterias_docerias_cafes));
router.get('/restaurantes', (req, res) => res.json(estabelecimentos.restaurantes));
router.get('/padarias', (req, res) => res.json(estabelecimentos.padarias));

// Buscar por nome
router.get('/buscar', (req, res) => {
  const { nome } = req.query;
  if (!nome) return res.status(400).json({ error: 'Informe o parâmetro nome' });

  const resultado = [];
  Object.values(estabelecimentos).forEach(categoria => {
    categoria.forEach(item => {
      if (item.nome.toLowerCase().includes(nome.toLowerCase())) resultado.push(item);
    });
  });
  res.json(resultado);
});

module.exports = router;
