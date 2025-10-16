export function calcularProximo(horarios, agora = new Date()) {
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();
  
    const proximo = horarios
      .map(h => {
        const [hora, minuto] = h.replace(/[Hh]/g, ":").split(":").map(Number);
        const diff = hora * 60 + minuto - (horaAtual * 60 + minutoAtual);
        return { horario: h, diff };
      })
      .filter(h => h.diff > 0)
      .sort((a, b) => a.diff - b.diff)[0];
  
    return proximo || null;
  }
  