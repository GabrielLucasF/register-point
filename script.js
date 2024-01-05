document.addEventListener('DOMContentLoaded', function () {
    updateClock();
    setInterval(updateClock, 1000);
    loadRegistros();
});

let cliques = 0;

function updateClock() {
    const now = new Date();
    const formattedDateTime = formatDateTime(now);
    document.getElementById('clock').textContent = formattedDateTime;
}

function formatDateTime(date) {
    const options = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };
    const formattedDateTime = new Intl.DateTimeFormat('pt-BR', options).format(date);

    return formattedDateTime.replace(',', '');
}

function registrarPonto() {
    const now = new Date();
    const formattedDateTime = formatDateTime(now);

    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const currentData = now.toLocaleDateString('pt-BR');

    const registrosDoDia = registros.filter(registro => registro.data === currentData);

    if (registrosDoDia.length >= 4) {
        alert("Todos os pontos do dia já foram batidos. Volte amanhã.");
        return;
    }

    cliques++;

    if (cliques > 4) {
        alert("Todos os pontos do dia já foram batidos. Volte amanhã.");
        return;
    }

    const tipo = getTipoRegistro(registros.length);
    registros.push({
        tipo: tipo,
        data: currentData,
        hora: formattedDateTime.split(" ")[1]
    });

    localStorage.setItem('registros', JSON.stringify(registros));

    loadRegistros();
}

function getTipoRegistro(count) {
    const tipos = ['Entrada', 'Saída Almoço', 'Volta Almoço', 'Saída'];
    return tipos[count % 4];
}

function loadRegistros() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const registrosList = document.getElementById('registros');
    registrosList.innerHTML = '';

    registros.forEach((registro, index) => {
        const li = document.createElement('li');
        li.textContent = `${registro.tipo}: ${registro.data} - ${registro.hora}`;

        if (index > 0 && registros[index - 1].data !== registro.data) {
            // Adiciona uma linha separadora entre registros de datas diferentes
            const hr = document.createElement('hr');
            registrosList.appendChild(hr);
        }

        registrosList.appendChild(li);
    });
}

function apagarRegistros() {
    const confirmacao = confirm("Tem certeza que deseja apagar todos os registros?");
    if (confirmacao) {
        localStorage.removeItem('registros');
        cliques = 0; // Reinicia a variável cliques
        loadRegistros(); // Atualiza a lista de registros exibida após a exclusão
    }
}