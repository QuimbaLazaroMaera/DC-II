// js/quizdata.js

console.log("quizdata.js carregado – esperando categoria...");

window.quizData = {};

async function carregarQuiz(categoria) {
    if (window.quizData[categoria] && window.quizData[categoria].length > 0) {
        console.log(`Quiz "${categoria}" já está em cache!`);
        return;
    }

    let arquivo = '';
    switch (categoria) {
        case 'bandeira': arquivo = 'Bandeira.json'; break;
        case 'emblema':  arquivo = 'Emblema.json';  break;
        case 'hino':     arquivo = 'Hino.json';     break;
        case 'herois':     arquivo = 'Perguntas_Gerais.json';     break;
        default:         arquivo = 'Bandeira.json';
    }

    try {
        // AQUI ESTÁ A MÁGICA: sai da pasta Front e entra na js/
        console.log(`Carregando ../js/${arquivo}`);
        const response = await fetch('../js/' + arquivo);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const dados = await response.json();

        window.quizData[categoria] = dados;
        window.quizData.geral = dados;

        console.log(`"${categoria}" carregado com sucesso!`, dados.length + " perguntas");
    } catch (erro) {
        console.error(`Erro ao carregar ${arquivo}:`, erro);
        document.getElementById('question').textContent = "Erro de conexão. Verifica a internet ou o nome do ficheiro.";
    }
}

window.carregarQuiz = carregarQuiz;