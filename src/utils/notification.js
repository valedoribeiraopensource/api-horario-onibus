import cron from "node-cron";
import fs from "fs";
import path from "path";

const dataPath = path.resolve("src/data/data.json");

export function startNotifications() {
  console.log("🔔 Sistema de notificações iniciado...");

  // Roda a cada minuto
  cron.schedule("* * * * *", () => {
    try {
      const rawData = fs.readFileSync(dataPath, "utf-8");
      const data = JSON.parse(rawData);

      // Garante que vai pegar tanto universitário quanto outras linhas, se existirem
      const onibusList = [
        ...(data.onibus_universitario || []),
        ...(data.onibus || []),
      ];

      const agora = new Date();
      const horaAtual = agora.getHours();
      const minutoAtual = agora.getMinutes();

      onibusList.forEach((linha) => {
        // Caso o formato tenha "dias"
        if (linha.dias && linha.dias.segunda_a_sexta) {
          const horarios = linha.dias.segunda_a_sexta;

          horarios.forEach((horarioStr) => {
            if (typeof horarioStr !== "string") return;

            // Corrige o formato (ex: "07h55 (extra)" → "07:55")
            const horarioLimpo = horarioStr.replace(/h/g, ":").split(" ")[0];
            const [hora, minuto] = horarioLimpo.split(":").map(Number);

            if (isNaN(hora) || isNaN(minuto)) return;

            const horaNotificacao = (hora - 1 + 24) % 24;
            const minutoNotificacao = minuto;

            if (horaAtual === horaNotificacao && minutoAtual === minutoNotificacao) {
              console.log(
                `📢 Lembrete: Ônibus ${linha.codigo || linha.linha} (${
                  linha.origem || linha.nome
                } → ${linha.destino || "Faculdade"}) sairá às ${horarioStr}.`
              );
            }
          });
        }

        // Caso tenha apenas "horario" (sem dias)
        else if (linha.horario) {
          const horarioLimpo = linha.horario.replace(/h/g, ":").split(" ")[0];
          const [hora, minuto] = horarioLimpo.split(":").map(Number);

          if (isNaN(hora) || isNaN(minuto)) return;

          const horaNotificacao = (hora - 1 + 24) % 24;
          const minutoNotificacao = minuto;

          if (horaAtual === horaNotificacao && minutoAtual === minutoNotificacao) {
            console.log(
              `📢 Lembrete: Ônibus ${linha.codigo || "sem código"} (${
                linha.origem || "Origem não informada"
              } → ${linha.destino || "Destino não informado"}) sairá às ${
                linha.horario
              }.`
            );
          }
        }

        // Caso não tenha nem dias nem horário
        else {
          console.warn(
            `⚠️ Linha ${linha.codigo || linha.linha || "sem identificação"} sem horários definidos.`
          );
        }
      });
    } catch (err) {
      console.error("❌ Erro ao verificar notificações:", err);
    }
  });
}
