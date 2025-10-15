const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const estabelecimentos = require('./data/estabelecimentos.json');


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

// Endpoints
app.get('/', (req, res) => {
  res.send('API Registro Food - Bares, Lanchonetes, Pizzarias, Sorveterias e Padarias');
});

app.get('/bares', (req, res) => {
  res.json(estabelecimentos.bares_lanchonetes_pizzarias_chopperias);
});

app.get('/sorveterias', (req, res) => {
  res.json(estabelecimentos.sorveterias_docerias_cafes);
});

app.get('/restaurantes', (req, res) => {
  res.json(estabelecimentos.restaurantes);
});

app.get('/padarias', (req, res) => {
  res.json(estabelecimentos.padarias);
});

// Filtro por nome (opcional)
app.get('/buscar', (req, res) => {
  const { nome } = req.query;
  if (!nome) return res.status(400).json({ error: 'Informe o parâmetro nome' });

  const resultado = [];
  Object.values(estabelecimentos).forEach(categoria => {
    categoria.forEach(item => {
      if (item.nome.toLowerCase().includes(nome.toLowerCase())) {
        resultado.push(item);
      }
    });
  });
  res.json(resultado);
});


app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
