import express from "express";
import http from 'http';
import cors from "cors";
import { startNotifications } from "./utils/notification.js";
import { calcularProximo } from "./services/calcularProximoOnibus.js";
// import estabelecimentosRoutes from "./routes/estabelecimentos.js";
// import eventosRoutes from "./routes/eventos.js";
import { Server } from "socket.io";
import onibusRoutes, { setupOnibusSocket } from "./routes/onibus.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));


setupOnibusSocket(io);

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

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
  
    // Recebe evento de monitoramento
    socket.on("monitorarOnibus", (dados) => {
      console.log("Monitorando:", dados);
      // Aqui podemos reutilizar suas funções de "proximo ônibus"
      // e enviar a cada 1 minuto a atualização:
      const intervalo = setInterval(() => {
        import("./routes/onibus.js").then(module => {
          // Função auxiliar que retorna o próximo ônibus
          const proximo = module.getProximoOnibus(dados); // você precisará criar essa função exportada
          socket.emit("proximoOnibus", proximo);
        });
      }, 60 * 1000); // a cada 1 minuto
  
      // Limpar ao desconectar
      socket.on("disconnect", () => clearInterval(intervalo));
    });
  });

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
