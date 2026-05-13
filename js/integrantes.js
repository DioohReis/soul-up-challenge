const itensDoCarrossel = document.querySelectorAll('.slide .item');
const secaoDetalhes = document.querySelector('#integrante-detalhes');
const imagemDetalhe = document.querySelector('#detalhe-imagem');
const nomeDetalhe = document.querySelector('#detalhe-nome');
const cargoDetalhe = document.querySelector('#detalhe-cargo');
const rmDetalhe = document.querySelector('#detalhe-rm');
const descricaoDetalhe = document.querySelector('#detalhe-descricao');

function mostrarIntegrante(item) {
    const { nome, cargo, rm, descricao, imagem } = item.dataset;

    imagemDetalhe.src = imagem;
    imagemDetalhe.alt = `Foto de ${nome}`;
    nomeDetalhe.textContent = nome;
    cargoDetalhe.textContent = cargo;
    rmDetalhe.textContent = `RM: ${rm}`;
    descricaoDetalhe.textContent = descricao;

    secaoDetalhes.classList.add('ativo');
    secaoDetalhes.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

itensDoCarrossel.forEach((item) => {
    item.addEventListener('click', () => mostrarIntegrante(item));
});
