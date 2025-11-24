// js/quiz.js

let perguntas = [];
let indice = 0;
let pontos = 0;

document.addEventListener("DOMContentLoaded", async () => {
    console.log("quiz.js iniciado");

    const urlParams = new URLSearchParams(window.location.search);
    let categoria = urlParams.get('categoria') || 'bandeira';

    // Padroniza os nomes
    const categoriasValidas = ['bandeira', 'emblema', 'hino','herois'];
    if (!categoriasValidas.includes(categoria)) categoria = 'bandeira';

    // 1. Primeiro carrega o quiz da categoria
    await window.carregarQuiz(categoria);

    // 2. Depois inicia o jogo
    perguntas = window.quizData[categoria] || window.quizData.bandeira;

    if (!perguntas || perguntas.length === 0) {
        document.getElementById('question').textContent = "Erro ao carregar o quiz. Tenta de novo.";
        return;
    }

    const titulos = {
        bandeira: "Bandeira Nacional",
        emblema: "Emblema Nacional",
        hino: "Hino Nacional",
        herois: "Herois Nacionais"
    };

    document.getElementById('quiz-title').textContent = `Quiz: ${titulos[categoria]}`;
    document.getElementById('total').textContent = perguntas.length;

    perguntas = perguntas.sort(() => Math.random() - 0.5);
    mostrarPergunta();
});

// === RESTO DO CÓDIGO (igual ao anterior) ===
function mostrarPergunta() {
    if (indice >= perguntas.length) return mostrarResultado();

    document.getElementById('current').textContent = indice + 1;
    document.getElementById('question').textContent = perguntas[indice].question;
    document.getElementById('answers').innerHTML = '';
    document.getElementById('next-btn').style.display = 'none';

    perguntas[indice].answers
        .sort(() => Math.random() - 0.5)
        .forEach(ans => {
            const btn = document.createElement('div');
            btn.className = 'answer-btn';
            btn.textContent = ans.text;
            btn.onclick = () => selecionarResposta(btn, ans.correct);
            document.getElementById('answers').appendChild(btn);
        });
}

function selecionarResposta(btn, correta) {
    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;

    if (correta) {
        btn.classList.add('correct');
        pontos++;
    } else {
        btn.classList.add('wrong');
    }

    document.querySelectorAll('.answer-btn').forEach(b => {
        if (perguntas[indice].answers.find(a => a.correct && a.text === b.textContent)) {
            b.classList.add('correct');
        }
        b.style.pointerEvents = 'none';
    });

    document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').onclick = () => {
    indice++;
    mostrarPergunta();
};

function mostrarResultado() {
    document.getElementById('quiz-body').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('score').textContent = pontos;
    document.getElementById('total-questions').textContent = perguntas.length;

    const percent = Math.round((pontos / perguntas.length) * 100);
    let mensagem = percent === 100 ? "PERFEITO!" :
                   percent >= 80 ? "EXCELENTE!" :
                   percent >= 60 ? "MUITO BOM!" : "DÁ PARA MELHORAR!";

    document.querySelector('.result').insertAdjacentHTML('beforeend',
        `<div style="font-size:50px;margin:20px 0;">${mensagem}<br>${percent}%</div>`
    );
}