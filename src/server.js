import express from "express";
import cors from "cors";
import { startNotifications } from "./utils/notification.js";
// import estabelecimentosRoutes from "./routes/estabelecimentos.js";
// import eventosRoutes from "./routes/eventos.js";
import onibusRoutes from "./routes/onibus.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa sistema de notificações
startNotifications();

app.use(cors());
app.use(express.json());

// Rota raiz
app.get("/", (req, res) => {
  res.send("API Registro/SP - Estabelecimentos e Eventos");
});

// Rotas
// app.use("/estabelecimentos", estabelecimentosRoutes);
// app.use("/eventos", eventosRoutes);
app.use("/onibus", onibusRoutes);

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
