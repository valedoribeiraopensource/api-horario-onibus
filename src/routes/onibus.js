const express = require('express');
const router = express.Router();
const data = require('../data/data.json');

// ---------------------
// ÔNIBUS URBANO
// ---------------------
router.get('/urbano', (req, res) => {
  res.json(data.onibus_urbano);
});

// Buscar linha urbana por código
router.get('/urbano/linha/:codigo', (req, res) => {
  const { codigo } = req.params;
  const linha = data.onibus_urbano.linhas.find(l => l.codigo.toLowerCase() === codigo.toLowerCase());
  if (!linha) return res.status(404).json({ error: 'Linha não encontrada' });
  res.json(linha);
});

// Filtrar urbano por dia (segunda_a_sexta, sabado, domingo_feriado)
router.get('/urbano/dia/:dia', (req, res) => {
  const { dia } = req.params;
  const resultado = data.onibus_urbano.linhas.map(linha => ({
    codigo: linha.codigo,
    nome: linha.nome,
    dias: linha.dias[dia] || {}
  }));
  res.json(resultado);
});

// ---------------------
// ÔNIBUS RURAL
// ---------------------
router.get('/rural', (req, res) => {
  res.json(data.onibus_rural);
});

router.get('/rural/linha/:codigo', (req, res) => {
  const { codigo } = req.params;
  const linha = data.onibus_rural.linhas.find(l => l.codigo.toLowerCase() === codigo.toLowerCase());
  if (!linha) return res.status(404).json({ error: 'Linha não encontrada' });
  res.json(linha);
});

// ---------------------
// ÔNIBUS UNIVERSITÁRIO
// ---------------------
router.get('/universitario', (req, res) => {
  res.json(data.onibus_universitario);
});

router.get('/universitario/linha/:codigo', (req, res) => {
  const { codigo } = req.params;
  const linha = data.onibus_universitario.linhas.find(l => l.codigo.toLowerCase() === codigo.toLowerCase());
  if (!linha) return res.status(404).json({ error: 'Linha não encontrada' });
  res.json(linha);
});

// Filtrar universitário por saída ou destino
router.get('/universitario/buscar', (req, res) => {
  const { saida, destino } = req.query;
  let resultado = data.onibus_universitario.linhas;

  if (saida) {
    resultado = resultado.filter(l => l.saida.toLowerCase().includes(saida.toLowerCase()));
  }
  if (destino) {
    resultado = resultado.filter(l => l.destino.toLowerCase().includes(destino.toLowerCase()));
  }

  res.json(resultado);
});

module.exports = router;
