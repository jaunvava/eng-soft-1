function initTransacoes() {
  const data = getData();
  const lista = document.getElementById("listaTransacoes");
  const selectCategoria = document.getElementById("categorias");

  function render() {
    if (!lista) return;
    lista.innerHTML = "";
    
    if (data.transacoes.length === 0) {
        lista.innerHTML = '<div class="text-center py-4 text-muted">Nenhuma transação encontrada.</div>';
        return;
    }

    const table = document.createElement("table");
    table.className = "table table-hover align-middle";
    table.innerHTML = `
        <thead class="table-light">
            <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th class="text-end">Valor</th>
                <th class="text-center">Ações</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    data.transacoes
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .forEach((t, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${new Date(t.data).toLocaleDateString("pt-BR")}</td>
            <td>${t.descricao}</td>
            <td><span class="badge ${t.tipo === 'receita' ? 'bg-success' : 'bg-secondary'}">${t.tipo === "receita" ? "Receita" : t.categoria}</span></td>
            <td class="text-end fw-bold ${t.tipo === "receita" ? "text-success" : "text-danger"}">${formatarMoeda(t.valor)}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editarTransacao(${i})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletarTransacao(${i})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
      });
    lista.appendChild(table);
  }

  if (selectCategoria) {
    selectCategoria.innerHTML = '<option value="" disabled selected>Escolha a categoria...</option>';
    data.categorias.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      selectCategoria.appendChild(opt);
    });
  }

  window.deletarTransacao = function (index) {
    if(confirm("Deseja realmente excluir esta transação?")) {
        data.transacoes.splice(index, 1);
        saveData(data);
        render();
    }
  };

  window.editarTransacao = function (index) {
    const t = data.transacoes[index];
    const modal = new bootstrap.Modal(document.getElementById('modalDialog'));
    
    document.getElementById("tipo").value = t.tipo;
    document.getElementById("valor").value = t.valor;
    document.getElementById("data").value = t.data;
    document.getElementById("descricao").value = t.descricao;
    if (t.categoria) document.getElementById("categorias").value = t.categoria;
    
    data.transacoes.splice(index, 1);
    saveData(data);
    modal.show();
  };

  const formTransacao = document.getElementById("formTransacao");
  if (formTransacao) {
    formTransacao.addEventListener("submit", (e) => {
      e.preventDefault();
      const tipo = document.getElementById("tipo").value;
      const val = parseFloat(document.getElementById("valor").value);
      const dt = document.getElementById("data").value;
      const desc = document.getElementById("descricao").value;
      const cat = document.getElementById("categorias").value;

      data.transacoes.push({
        id: Date.now(),
        tipo: tipo,
        descricao: desc,
        valor: val,
        data: dt,
        categoria: tipo === 'despesa' ? cat : 'Receita'
      });
      
      saveData(data);
      formTransacao.reset();
      
      const modalInstance = bootstrap.Modal.getInstance(document.getElementById('modalDialog'));
      if(modalInstance) modalInstance.hide();
      
      render();
    });
  }

  const btnOpen = document.getElementById("botaoAbrirTransacao");
  if (btnOpen) {
      btnOpen.onclick = () => {
          const modal = new bootstrap.Modal(document.getElementById('modalDialog'));
          modal.show();
      };
  }

  render();
}
