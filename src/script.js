function criarGrafico(idCanvas, tipo, labels, dados, labelDataset) {
    const grafico = document.getElementById(idCanvas).getContext('2d');

    return new Chart(grafico, {
        type: tipo,
        data: {
            labels: labels,
            datasets: [{
                label: labelDataset,
                data: dados
            }]
        }
    });
}

criarGrafico('despesasPorCategoria', 'bar', ['Alimentação', 'Transporte'], [500, 300], 'Despesas');
criarGrafico('receitasPorCategoria', 'line', ['Salário', 'Freela'], [3000, 800], 'Receitas');
criarGrafico('saldoMensal', 'bar', ['Jan', 'Fev'], [1200, 1800], 'Saldo');