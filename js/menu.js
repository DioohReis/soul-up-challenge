document.addEventListener('DOMContentLoaded', () => {
    const menuButtons = document.querySelectorAll('.menu-toggle');

    menuButtons.forEach((menuButton) => {
        const menuId = menuButton.getAttribute('aria-controls');
        const menu = menuId ? document.getElementById(menuId) : document.querySelector('.main-menu, nav');

        if (!menu) return;

        const closeMenu = () => {
            menu.classList.remove('is-open');
            menuButton.classList.remove('is-active');
            document.body.classList.remove('menu-open');
            menuButton.setAttribute('aria-expanded', 'false');
        };

        const openMenu = () => {
            menu.classList.add('is-open');
            menuButton.classList.add('is-active');
            document.body.classList.add('menu-open');
            menuButton.setAttribute('aria-expanded', 'true');
        };

        menuButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            menu.classList.contains('is-open') ? closeMenu() : openMenu();
        });

        menu.addEventListener('click', (event) => {
            if (event.target.closest('a')) closeMenu();
        });

        document.addEventListener('click', (event) => {
            if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    });

    atualizarResumoHome();
});

function atualizarResumoHome() {
    const homeLevel = document.querySelector('#home-level');
    const homeTotalPoints = document.querySelector('#home-total-points');
    const homeCompletedCount = document.querySelector('#home-completed-count');
    const homeImpactPercent = document.querySelector('#home-impact-percent');
    const homeImpactSummary = document.querySelector('#home-impact-summary');
    const homeLumenText = document.querySelector('#home-lumen-main-text');
    const homeLumenLabel = document.querySelector('#home-lumen-label');

    if (!homeLevel || !homeTotalPoints || !homeCompletedCount) return;

    const pontos = Number(localStorage.getItem('pontosSoulUp')) || 0;
    const questsConcluidas = obterQuestsConcluidas();
    const totalQuests = 15;
    const totalConcluidas = questsConcluidas.length;
    const nivel = obterNivelHome(pontos);
    const impacto = Math.min(Math.round((totalConcluidas / totalQuests) * 100), 100);
    const usuario = obterUsuarioHome();
    const mensagem = criarMensagemImpacto(totalConcluidas, pontos, nivel.nome);

    homeLevel.textContent = nivel.nome;
    homeTotalPoints.textContent = pontos;
    homeCompletedCount.textContent = totalConcluidas;

    // Mantém a animação de contagem do lumen.js usando o mesmo valor real do localStorage.
    // Sem isso, o lumen.js poderia ler data-count="0" e sobrescrever os números das caixas.
    homeTotalPoints.dataset.count = String(pontos);
    homeCompletedCount.dataset.count = String(totalConcluidas);

    if (homeImpactPercent) homeImpactPercent.textContent = `${impacto}%`;
    if (homeImpactSummary) homeImpactSummary.textContent = mensagem.resumo;

    if (homeLumenLabel) {
        homeLumenLabel.textContent = usuario && usuario.nome
            ? `Olá, ${usuario.nome}`
            : 'Guia da experiência';
    }

    if (homeLumenText) {
        homeLumenText.textContent = totalConcluidas > 0
            ? 'Seu progresso está atualizado nas caixas ao redor. Continue completando quests para evoluir seu impacto ambiental.'
            : 'Complete quests na página Experiência e acompanhe seu nível, pontos, missões e impacto nas caixas ao redor.';
    }
}

function obterQuestsConcluidas() {
    const dados = localStorage.getItem('questsConcluidasSoulUp');

    if (!dados) return [];

    try {
        const quests = JSON.parse(dados);
        return Array.isArray(quests) ? quests : [];
    } catch (erro) {
        localStorage.removeItem('questsConcluidasSoulUp');
        return [];
    }
}

function obterUsuarioHome() {
    const dados = localStorage.getItem('usuarioSoulUp');

    if (!dados) return null;

    try {
        return JSON.parse(dados);
    } catch (erro) {
        localStorage.removeItem('usuarioSoulUp');
        return null;
    }
}

function obterNivelHome(pontos) {
    if (pontos >= 500) return { nome: 'Guardião Verde' };
    if (pontos >= 300) return { nome: 'Eco Líder' };
    if (pontos >= 120) return { nome: 'Eco Ativo' };
    return { nome: 'Eco Iniciante' };
}

function criarMensagemImpacto(totalConcluidas, pontos, nivel) {
    if (totalConcluidas === 0) {
        return {
            resumo: 'Complete quests para visualizar seu impacto ambiental.',
            curta: 'A Lumën ainda está esperando sua primeira ação sustentável.'
        };
    }

    if (totalConcluidas <= 2) {
        return {
            resumo: 'Você iniciou uma rotina mais consciente, reduzindo desperdícios e observando melhor seus hábitos.',
            curta: 'Suas ações já ajudam a economizar recursos e evitar consumo desnecessário.'
        };
    }

    if (totalConcluidas <= 5) {
        return {
            resumo: 'Suas quests indicam avanço em economia de água, energia, descarte correto e consumo consciente.',
            curta: 'Seu progresso mostra atitudes reais contra desperdício e poluição.'
        };
    }

    return {
        resumo: 'Você está criando uma rotina de impacto positivo para reduzir resíduos, economizar recursos e proteger o meio ambiente.',
        curta: `Com ${pontos} pontos e nível ${nivel}, você demonstra constância em escolhas ambientais melhores.`
    };
}



window.addEventListener('pageshow', atualizarResumoHome);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) atualizarResumoHome();
});
