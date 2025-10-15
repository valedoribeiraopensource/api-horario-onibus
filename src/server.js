const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Importa rotas
const estabelecimentosRoutes = require('./routes/estabelecimentos');
const eventosRoutes = require('./routes/eventos');
const onibusRoutes = require('./routes/onibus');


app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.send('API Registro/SP - Estabelecimentos e Eventos');
});

// Rotas
app.use('/estabelecimentos', estabelecimentosRoutes);
app.use('/eventos', eventosRoutes);
app.use('/onibus', onibusRoutes);


// Inicializa servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
