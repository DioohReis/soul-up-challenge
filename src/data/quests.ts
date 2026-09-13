import type { EcologicalProblem } from "../types";

export const ecologicalProblems: EcologicalProblem[] = [
  {
    id: "clima",
    titulo: "Mudanças climáticas",
    causa: "Alta emissão de gases de efeito estufa e matriz fóssil",
    resumo:
      "Uso de energia, transporte movido a combustíveis fósseis e consumo sem controle aumentam emissões e desperdício de recursos.",
    mensagem:
      "Comece por ações de energia e transporte. São hábitos simples de medir, pontuar e transformar em evolução dentro da plataforma.",
    quests: [
      {
        titulo: "Modo economia por 2 horas",
        dificuldade: "facil",
        pontos: 40,
        tempo: "10 min de preparação",
        descricao:
          "Desligue luzes desnecessárias, tire carregadores da tomada e reduza o brilho da tela por pelo menos 2 horas.",
      },
      {
        titulo: "Trajeto de baixo carbono",
        dificuldade: "medio",
        pontos: 80,
        tempo: "1 deslocamento",
        descricao:
          "Faça um trajeto curto caminhando, de bicicleta, transporte público ou carona compartilhada.",
      },
      {
        titulo: "Dia com consumo consciente",
        dificuldade: "dificil",
        pontos: 140,
        tempo: "1 dia",
        descricao:
          "Passe um dia sem compras por impulso e registre três escolhas que reduziram gasto de energia ou recursos.",
      },
    ],
  },
  {
    id: "residuos",
    titulo: "Resíduos e descarte incorreto",
    causa: "Consumo excessivo, descarte incorreto e baixa reciclagem",
    resumo:
      "O aumento de resíduos pressiona coleta, aterros e reciclagem. Separar, reduzir e reutilizar evita desperdício e melhora o impacto ambiental.",
    mensagem:
      "Para resíduos, a melhor quest é objetiva: separar, reutilizar e reduzir. A Lumën pontua ações fáceis de comprovar no dia a dia.",
    quests: [
      {
        titulo: "Separação inteligente",
        dificuldade: "facil",
        pontos: 35,
        tempo: "15 min",
        descricao:
          "Separe papel, plástico, metal ou vidro de um descarte comum e identifique onde cada item deveria ir.",
      },
      {
        titulo: "Reutilize antes de jogar fora",
        dificuldade: "medio",
        pontos: 75,
        tempo: "30 min",
        descricao:
          "Escolha uma embalagem ou objeto e encontre uma forma útil de reutilizá-lo por mais uma semana.",
      },
      {
        titulo: "Dia lixo mínimo",
        dificuldade: "dificil",
        pontos: 130,
        tempo: "1 dia",
        descricao:
          "Planeje um dia tentando gerar o mínimo possível de lixo descartável e anote quais escolhas ajudaram mais.",
      },
    ],
  },
  {
    id: "agua",
    titulo: "Desperdício de água",
    causa: "Uso irresponsável e vazamentos não monitorados",
    resumo:
      "Banhos longos, torneiras abertas e pequenos vazamentos aumentam desperdício. Medir o uso ajuda a mudar comportamento.",
    mensagem:
      "Água combina muito com missões rápidas. O usuário entende o impacto quando percebe onde desperdiça sem notar.",
    quests: [
      {
        titulo: "Banho cronometrado",
        dificuldade: "facil",
        pontos: 30,
        tempo: "1 banho",
        descricao:
          "Reduza o tempo do banho e registre quantos minutos conseguiu economizar em relação ao normal.",
      },
      {
        titulo: "Caça ao vazamento",
        dificuldade: "medio",
        pontos: 70,
        tempo: "20 min",
        descricao:
          "Verifique torneiras, descarga e cozinha procurando sinais de vazamento ou uso desnecessário de água.",
      },
      {
        titulo: "Rotina de reuso",
        dificuldade: "dificil",
        pontos: 120,
        tempo: "1 dia",
        descricao:
          "Encontre uma forma segura de reutilizar água em uma tarefa doméstica, como limpeza de área externa ou rega.",
      },
    ],
  },
  {
    id: "biodiversidade",
    titulo: "Perda de biodiversidade",
    causa: "Desmatamento e perda de conexão com áreas verdes",
    resumo:
      "A natureza depende de habitats preservados. Pequenas ações de cuidado com áreas verdes ajudam a criar consciência e proteção local.",
    mensagem:
      "Aqui a experiência conecta o usuário com o ambiente ao redor. A quest parece simples, mas ajuda a criar vínculo com a natureza.",
    quests: [
      {
        titulo: "Mapa verde do bairro",
        dificuldade: "facil",
        pontos: 45,
        tempo: "20 min",
        descricao:
          "Identifique uma praça, árvore ou área verde próxima e registre por que ela é importante para a comunidade.",
      },
      {
        titulo: "Cuidado com uma planta",
        dificuldade: "medio",
        pontos: 85,
        tempo: "1 semana",
        descricao:
          "Escolha uma planta para cuidar durante a semana, acompanhando luz, água e crescimento.",
      },
      {
        titulo: "Ação de preservação local",
        dificuldade: "dificil",
        pontos: 150,
        tempo: "1 ação",
        descricao:
          "Participe ou organize uma pequena ação de cuidado com área verde, como limpeza segura ou conscientização.",
      },
    ],
  },
  {
    id: "poluicao",
    titulo: "Poluição urbana",
    causa: "Emissões veiculares e descarte irregular de materiais",
    resumo:
      "Poluição afeta ar, água, solo e saúde. A experiência incentiva escolhas que reduzam exposição e descarte incorreto.",
    mensagem:
      "Para poluição, a Lumën recomenda missões visíveis: observar o problema, reduzir descartáveis e compartilhar uma solução simples.",
    quests: [
      {
        titulo: "Observador da poluição",
        dificuldade: "facil",
        pontos: 35,
        tempo: "15 min",
        descricao:
          "Observe um ponto com lixo, fumaça ou descarte irregular e pense em uma ação preventiva para esse problema.",
      },
      {
        titulo: "Sem descartável hoje",
        dificuldade: "medio",
        pontos: 80,
        tempo: "1 dia",
        descricao:
          "Evite copos, sacolas ou talheres descartáveis por um dia e registre qual item foi mais fácil substituir.",
      },
      {
        titulo: "Mini campanha consciente",
        dificuldade: "dificil",
        pontos: 135,
        tempo: "1 publicação ou conversa",
        descricao:
          "Crie uma mensagem curta de conscientização sobre descarte correto ou redução de poluição e compartilhe com alguém.",
      },
    ],
  },
];
