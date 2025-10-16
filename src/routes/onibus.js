import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do JSON
const dataPath = path.resolve(__dirname, "../data/data.json");

// Lê o JSON inicial
const rawData = fs.readFileSync(dataPath, "utf-8");
const data = JSON.parse(rawData);

const router = express.Router();

// ---------------------
// ÔNIBUS URBANO
// ---------------------
router.get("/urbano", (req, res) => {
  res.json(data.onibus_urbano);
});

router.get("/urbano/linha/:codigo", (req, res) => {
  const { codigo } = req.params;
  const linha = data.onibus_urbano.linhas.find(
    (l) => l.codigo.toLowerCase() === codigo.toLowerCase()
  );
  if (!linha) return res.status(404).json({ error: "Linha não encontrada" });
  res.json(linha);
});

router.get("/urbano/dia/:dia", (req, res) => {
  const { dia } = req.params;
  const resultado = data.onibus_urbano.linhas.map((linha) => ({
    codigo: linha.codigo,
    nome: linha.nome,
    dias: linha.dias[dia] || {},
  }));
  res.json(resultado);
});

// ---------------------
// ÔNIBUS RURAL
// ---------------------
router.get("/rural", (req, res) => {
  res.json(data.onibus_rural);
});

router.get("/rural/linha/:codigo", (req, res) => {
  const { codigo } = req.params;
  const linha = data.onibus_rural.linhas.find(
    (l) => l.codigo.toLowerCase() === codigo.toLowerCase()
  );
  if (!linha) return res.status(404).json({ error: "Linha não encontrada" });
  res.json(linha);
});

// ---------------------
// ÔNIBUS UNIVERSITÁRIO
// ---------------------
router.get("/universitario", (req, res) => {
  res.json(data.onibus_universitario);
});

router.get("/universitario/linha/:codigo", (req, res) => {
  const { codigo } = req.params;
  const linha = data.onibus_universitario.linhas.find(
    (l) => l.codigo.toLowerCase() === codigo.toLowerCase()
  );
  if (!linha) return res.status(404).json({ error: "Linha não encontrada" });
  res.json(linha);
});

router.get("/universitario/buscar", (req, res) => {
  const { saida, destino } = req.query;
  let resultado = data.onibus_universitario.linhas;

  if (saida) {
    resultado = resultado.filter((l) =>
      l.saida.toLowerCase().includes(saida.toLowerCase())
    );
  }
  if (destino) {
    resultado = resultado.filter((l) =>
      l.destino.toLowerCase().includes(destino.toLowerCase())
    );
  }

  res.json(resultado);
});

// ---------------------
// PRÓXIMO ÔNIBUS
// ---------------------
router.get("/proximo-onibus", (req, res) => {
  const { linha, dia = "segunda_a_sexta" } = req.query;

  if (!linha) {
    return res.status(400).json({ erro: "Parâmetro 'linha' é obrigatório." });
  }

  try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(rawData);
    const onibusList = data.onibus_universitario || [];
    
    const bus = onibusList.find(
      (o) => o?.linha?.toLowerCase() === linha.toLowerCase()
    );
    
    if (!bus) {
      return res.status(404).json({ erro: "Linha não encontrada." });
    }
    

    const horarios = bus.dias?.[dia];
    if (!horarios || horarios.length === 0) {
      return res.status(404).json({ erro: "Nenhum horário disponível para esse dia." });
    }

    const agora = new Date();
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();

    const proximo = horarios
      .map((h) => {
        const [hora, minuto] = h.replace("h", ":").split(":").map(Number);
        const diff = hora * 60 + minuto - (horaAtual * 60 + minutoAtual);
        return { horario: h, diff };
      })
      .filter((h) => h.diff > 0)
      .sort((a, b) => a.diff - b.diff)[0];

    if (!proximo) {
      return res.json({
        linha: bus.codigo,
        origem: bus.origem,
        destino: bus.destino,
        mensagem: "Nenhum ônibus restante hoje.",
      });
    }

    return res.json({
      linha: bus.codigo,
      origem: bus.origem,
      destino: bus.destino,
      proximo_horario: proximo.horario,
      minutos_restantes: proximo.diff,
    });
  } catch (err) {
    console.error("Erro ao buscar próximo ônibus:", err);
    res.status(500).json({ erro: "Erro interno ao processar o pedido." });
  }
});

router.get("/proximo-onibus-rural", (req, res) => {
  const { codigo, dia = "segunda_a_sexta" } = req.query;

  if (!codigo) {
    return res.status(400).json({ erro: "Parâmetro 'codigo' é obrigatório." });
  }

  try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(rawData);
    const onibusList = data.onibus_rural || [];

    // Procurar o sentido pelo código
    let sentidoEncontrado;
    for (const linha of onibusList) {
      sentidoEncontrado = linha.sentidos.find(
        (s) => s.codigo.toLowerCase() === codigo.toLowerCase()
      );
      if (sentidoEncontrado) break;
    }

    if (!sentidoEncontrado) {
      return res.status(404).json({ erro: "Sentido não encontrado." });
    }

    const horarios = sentidoEncontrado.dias?.[dia];
    if (!horarios || horarios.length === 0) {
      return res.status(404).json({ erro: "Nenhum horário disponível para esse dia." });
    }

    const agora = new Date();
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();

    // Próximo horário
    const proximo = horarios
      .map((h) => {
        // Transformar "05H00" em [5,0]
        const [hora, minuto] = h.replace("H", ":").split(":").map(Number);
        const diff = hora * 60 + minuto - (horaAtual * 60 + minutoAtual);
        return { horario: h, diff };
      })
      .filter((h) => h.diff > 0)
      .sort((a, b) => a.diff - b.diff)[0];

    if (!proximo) {
      return res.json({
        codigo: sentidoEncontrado.codigo,
        origem: sentidoEncontrado.origem,
        destino: sentidoEncontrado.destino,
        mensagem: "Nenhum ônibus restante hoje."
      });
    }

    return res.json({
      codigo: sentidoEncontrado.codigo,
      origem: sentidoEncontrado.origem,
      destino: sentidoEncontrado.destino,
      proximo_horario: proximo.horario,
      minutos_restantes: proximo.diff
    });

  } catch (err) {
    console.error("Erro ao buscar próximo ônibus rural:", err);
    res.status(500).json({ erro: "Erro interno ao processar o pedido." });
  }
});

// Próximo ônibus urbano
router.get("/proximo-onibus-urbano", (req, res) => {
  const { codigo, dia = "segunda_a_sexta" } = req.query;

  if (!codigo) {
    return res.status(400).json({ erro: "Parâmetro 'codigo' é obrigatório." });
  }

  try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(rawData);
    const onibusList = data.onibus_urbano || [];

    let sentidoEncontrado;
    let horarios = [];

    for (const linha of onibusList) {
      // Caso 1: linha com 'sentidos' (como L3, L4, L5, L6)
      if (linha.sentidos) {
        sentidoEncontrado = linha.sentidos.find(
          (s) => s.codigo.toLowerCase() === codigo.toLowerCase()
        );
        if (sentidoEncontrado) {
          horarios = sentidoEncontrado.dias?.[dia] || [];
          break;
        }
      } else if (linha.dias) {
        // Caso 2: linha com dias diretamente (como L7, L8, L9)
        const diaObj = linha.dias[dia];
        if (diaObj && diaObj[codigo]) {
          sentidoEncontrado = {
            codigo,
            origem: diaObj[codigo].saida || "",
            destino: "Ver itinerário",
            itinerario: diaObj[codigo].itinerario || "",
          };
          horarios = diaObj[codigo].horarios || [];
          break;
        }
      }
    }

    if (!sentidoEncontrado) {
      return res.status(404).json({ erro: "Sentido não encontrado." });
    }

    if (!horarios || horarios.length === 0) {
      return res.status(404).json({ erro: "Nenhum horário disponível para esse dia." });
    }

    const agora = new Date();
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();

    const proximo = horarios
      .map((h) => {
        const cleaned = h.replace(/[Hh]/g, ":").split(/[:\s]/); // remove 'h' e possíveis extras
        const hora = parseInt(cleaned[0]);
        const minuto = parseInt(cleaned[1] || 0);
        const diff = hora * 60 + minuto - (horaAtual * 60 + minutoAtual);
        return { horario: h, diff };
      })
      .filter((h) => h.diff > 0)
      .sort((a, b) => a.diff - b.diff)[0];

    if (!proximo) {
      return res.json({
        codigo: sentidoEncontrado.codigo,
        origem: sentidoEncontrado.origem,
        destino: sentidoEncontrado.destino,
        mensagem: "Nenhum ônibus restante hoje.",
      });
    }

    return res.json({
      codigo: sentidoEncontrado.codigo,
      origem: sentidoEncontrado.origem,
      destino: sentidoEncontrado.destino,
      proximo_horario: proximo.horario,
      minutos_restantes: proximo.diff,
      itinerario: sentidoEncontrado.itinerario || ""
    });

  } catch (err) {
    console.error("Erro ao buscar próximo ônibus urbano:", err);
    res.status(500).json({ erro: "Erro interno ao processar o pedido." });
  }
});


export default router;
