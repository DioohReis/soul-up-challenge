import type { EcologicalProblem } from "../types";

export const ecologicalProblems: EcologicalProblem[] = [
  {
    id: "clima",
    titulo: "Mudanças climáticas",
    causa: "Alta emissão de gases de efeito estufa e matriz fóssil",
    resumo:
      "O uso intenso de energias não renováveis e o consumo desenfreado aceleram o aquecimento global, exigindo mudanças imediatas de hábito.",
    mensagem:
      "Sua jornada começa otimizando energia e transporte. Pequenas ações diárias geram grandes pontos de impacto e ajudam a reverter esse cenário.",
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
      "O volume crescente de lixo sobrecarrega aterros sanitários. A adoção da economia circular (reduzir, reutilizar e reciclar) é o caminho.",
    mensagem:
      "Transforme o que seria lixo em recurso. Nesta categoria, suas missões envolvem separar corretamente os materiais e repensar suas embalagens.",
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
      "A água potável é um recurso finito e precioso. Alterações simples na rotina podem economizar milhares de litros por ano.",
    mensagem:
      "Foque em missões de curto prazo. Fechar a torneira e identificar vazamentos são as formas mais rápidas de acumular pontos e salvar recursos.",
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
      "A preservação da flora e fauna locais mantém o equilíbrio ecológico, essencial para a qualidade de vida e a saúde dos ecossistemas.",
    mensagem:
      "Reconecte-se com o meio ambiente ao seu redor. Suas missões aqui envolvem mapear, cuidar e proteger as áreas verdes da sua comunidade.",
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
      "A poluição afeta severamente a qualidade do ar, da água e a nossa saúde. Reduzir a pegada de descartáveis é um passo vital.",
    mensagem:
      "Seja um agente fiscalizador ambiental. Suas missões focam na observação crítica, redução de plásticos de uso único e conscientização.",
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
