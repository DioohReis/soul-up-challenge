const usuariosCadastrados = [
    {
        nome: 'Diogo Guilherme',
        email: 'diogo@soulup.com',
        senha: 'diogo123'
    },
    {
        nome: 'Gabriel Ricardo',
        email: 'gabriel@soulup.com',
        senha: 'gabriel123'
    },
    {
        nome: 'Matheus Rodrigues',
        email: 'matheus@soulup.com',
        senha: 'matheus123'
    },
    {
        nome: 'Luiz Henrique',
        email: 'luiz@soulup.com',
        senha: 'luiz123'
    },
    {
        nome: 'Razo',
        email: 'razo@soulup.com',
        senha: 'razo123'
    }
];

const formularioLogin = document.querySelector('#login-form');
const campoEmail = document.querySelector('#login-email');
const campoSenha = document.querySelector('#login-senha');
const modalLogin = document.querySelector('#login-modal');
const modalTitulo = document.querySelector('#modal-title');
const modalMensagem = document.querySelector('#modal-message');
const modalIcone = document.querySelector('#modal-icon');
const modalContagem = document.querySelector('#modal-countdown');
const botoesFecharModal = document.querySelectorAll('[data-close-modal]');
const botoesUsuariosTeste = document.querySelectorAll('.user-demo');

let intervaloRedirecionamento;
let loginAprovado = false;

function buscarUsuarioPorEmail(email) {
    return usuariosCadastrados.find((usuario) => usuario.email.toLowerCase() === email.toLowerCase());
}

function abrirModal(tipo, titulo, mensagem) {
    modalLogin.className = `login-modal is-open login-modal--${tipo}`;
    modalLogin.setAttribute('aria-hidden', 'false');
    modalTitulo.textContent = titulo;
    modalMensagem.textContent = mensagem;
    modalIcone.textContent = tipo === 'success' ? '✓' : '!';
    modalContagem.textContent = '';
}

function fecharModal() {
    modalLogin.classList.remove('is-open');
    modalLogin.setAttribute('aria-hidden', 'true');

    if (intervaloRedirecionamento && !loginAprovado) {
        clearInterval(intervaloRedirecionamento);
        intervaloRedirecionamento = null;
    }
}

function iniciarRedirecionamento() {
    let segundos = 3;
    modalContagem.textContent = `Redirecionando para a experiência em ${segundos} segundos...`;

    intervaloRedirecionamento = setInterval(() => {
        segundos -= 1;

        if (segundos > 0) {
            modalContagem.textContent = `Redirecionando para a experiência em ${segundos} segundos...`;
            return;
        }

        clearInterval(intervaloRedirecionamento);
        window.location.href = 'experiencia.html';
    }, 1000);
}

function salvarUsuarioLogado(usuario) {
    const dadosUsuario = {
        nome: usuario.nome,
        email: usuario.email
    };

    localStorage.setItem('usuarioSoulUp', JSON.stringify(dadosUsuario));
}

function validarLogin(evento) {
    evento.preventDefault();

    const email = campoEmail.value.trim();
    const senha = campoSenha.value.trim();

    if (!email || !senha) {
        abrirModal('error', 'Preencha todos os campos', 'Informe o e-mail e a senha para continuar.');
        return;
    }

    const usuarioEncontrado = buscarUsuarioPorEmail(email);

    if (!usuarioEncontrado) {
        abrirModal('error', 'Usuário não cadastrado', 'Verifique o endereço digitado.');
        return;
    }

    if (usuarioEncontrado.senha !== senha) {
        abrirModal('error', 'Senha incorreta');
        return;
    }

    salvarUsuarioLogado(usuarioEncontrado);
    loginAprovado = true;
    abrirModal('success', `Bem-vindo, ${usuarioEncontrado.nome}!`, 'Login realizado com sucesso. A Lumën vai usar seu nome na experiência interativa.');
    iniciarRedirecionamento();
}

function preencherUsuarioTeste(botao) {
    campoEmail.value = botao.dataset.email;
    campoSenha.value = botao.dataset.senha;
    campoEmail.focus();
}

if (formularioLogin) {
    formularioLogin.addEventListener('submit', validarLogin);
}

botoesUsuariosTeste.forEach((botao) => {
    botao.addEventListener('click', () => preencherUsuarioTeste(botao));
});

botoesFecharModal.forEach((botao) => {
    botao.addEventListener('click', fecharModal);
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && modalLogin.classList.contains('is-open')) {
        fecharModal();
    }
});
