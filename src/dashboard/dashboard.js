function initDashboard() {
  const data = getData();
  let receitas = 0;
  let despesas = 0;

  const gastosPorCategoria = {};
  data.categorias.forEach((c) => (gastosPorCategoria[c] = 0));

  data.transacoes.forEach((t) => {
    if (t.tipo === "receita") {
      receitas += t.valor;
    } else {
      despesas += t.valor;
      if (gastosPorCategoria[t.categoria] !== undefined) {
        gastosPorCategoria[t.categoria] += t.valor;
      } else {
        gastosPorCategoria["Outros"] = (gastosPorCategoria["Outros"] || 0) + t.valor;
      }
    }
  });

  const saldo = receitas - despesas;

  const saldoEl = document.getElementById("saldo-display");
  const receitasEl = document.getElementById("receitas-display");
  const despesasEl = document.getElementById("despesas-display");

  if (saldoEl) saldoEl.textContent = formatarMoeda(saldo);
  if (receitasEl) receitasEl.textContent = formatarMoeda(receitas);
  if (despesasEl) despesasEl.textContent = formatarMoeda(despesas);

  // Charts
  const ctxSaldo = document.getElementById("graficoSaldo");
  if (ctxSaldo) {
    new Chart(ctxSaldo.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Início", "Atual"],
        datasets: [{
          label: "Evolução do Saldo",
          data: [0, saldo],
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.1)",
          fill: true,
          tension: 0.4
        }],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  const ctxDespesas = document.getElementById("graficoDespesas");
  if (ctxDespesas) {
    new Chart(ctxDespesas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: Object.keys(gastosPorCategoria),
        datasets: [{
          data: Object.values(gastosPorCategoria),
          backgroundColor: ["#ef4444", "#3b82f6", "#eab308", "#8b5cf6", "#6b7280", "#10b981", "#f97316", "#6366f1"],
        }],
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' }
        }
      },
    });
  }
}
