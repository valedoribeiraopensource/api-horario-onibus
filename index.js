const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Endpoint para retornar todos os dados
app.get('/onibus', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro ao ler o arquivo' });
    res.json(JSON.parse(data));
  });
});

// Endpoint para consultar uma linha específica
app.get('/onibus/:tipo/:codigo', (req, res) => {
  const { tipo, codigo } = req.params;
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro ao ler o arquivo' });
    const json = JSON.parse(data);
    const linha = json[tipo]?.linhas.find(l => l.codigo === codigo);
    if (!linha) return res.status(404).json({ error: 'Linha não encontrada' });
    res.json(linha);
  });
});

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
