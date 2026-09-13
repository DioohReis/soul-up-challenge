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
          "Desative luzes desnecessárias, desconecte carregadores inativos e ative o modo economia de energia nos seus dispositivos por 2 horas.",
      },
      {
        titulo: "Trajeto de baixo carbono",
        dificuldade: "medio",
        pontos: 80,
        tempo: "1 deslocamento",
        descricao:
          "Substitua um trajeto motorizado por uma caminhada, uso de bicicleta, transporte público ou organize uma carona solidária.",
      },
      {
        titulo: "Dia com consumo consciente",
        dificuldade: "dificil",
        pontos: 140,
        tempo: "1 dia",
        descricao:
          "Sobreviva a um dia inteiro sem compras supérfluas e registre no sistema 3 ações reais que reduziram seu gasto de energia.",
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
          "Realize a triagem de recicláveis (papel, plástico, metal, vidro) do lixo comum e destine-os ao local correto de coleta.",
      },
      {
        titulo: "Reutilize antes de jogar fora",
        dificuldade: "medio",
        pontos: 75,
        tempo: "30 min",
        descricao:
          "Resgate uma embalagem ou objeto prestes a ser descartado e atribua a ele uma nova função prática por, no mínimo, uma semana.",
      },
      {
        titulo: "Dia lixo mínimo",
        dificuldade: "dificil",
        pontos: 130,
        tempo: "1 dia",
        descricao:
          "Planeje um dia gerando o mínimo absoluto de lixo não-reciclável e documente as estratégias de substituição que você utilizou.",
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
          "Cronometre seu banho, reduza o tempo habitual e registre exatamente quantos minutos de água corrente você economizou.",
      },
      {
        titulo: "Caça ao vazamento",
        dificuldade: "medio",
        pontos: 70,
        tempo: "20 min",
        descricao:
          "Faça uma inspeção técnica nas torneiras, chuveiros e descargas da sua casa em busca de vazamentos ou goteiras ocultas.",
      },
      {
        titulo: "Rotina de reuso",
        dificuldade: "dificil",
        pontos: 120,
        tempo: "1 dia",
        descricao:
          "Implemente um sistema seguro para reutilizar água em uma tarefa doméstica (ex: usar água da máquina para lavar o quintal).",
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
          "Mapeie uma praça ou área verde próxima à sua residência e documente a importância desse ecossistema para a comunidade local.",
      },
      {
        titulo: "Cuidado com uma planta",
        dificuldade: "medio",
        pontos: 85,
        tempo: "1 semana",
        descricao:
          "Adote uma planta local por uma semana. Monitore ativamente sua exposição à luz, necessidade de água e desenvolvimento geral.",
      },
      {
        titulo: "Ação de preservação local",
        dificuldade: "dificil",
        pontos: 150,
        tempo: "1 ação",
        descricao:
          "Lidere ou participe ativamente de uma ação de preservação em uma área verde (limpeza responsável, plantio ou conscientização).",
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
          "Identifique um foco de poluição (lixo acumulado, fumaça, descarte irregular) e crie um plano de ação preventivo para a área.",
      },
      {
        titulo: "Sem descartável hoje",
        dificuldade: "medio",
        pontos: 80,
        tempo: "1 dia",
        descricao:
          "Boicote completamente o uso de copos, sacolas ou talheres plásticos descartáveis por 24 horas e registre a experiência.",
      },
      {
        titulo: "Mini campanha consciente",
        dificuldade: "dificil",
        pontos: 135,
        tempo: "1 publicação ou conversa",
        descricao:
          "Desenvolva um conteúdo curto de conscientização sobre descarte correto e dissemine ativamente para sua rede de contatos.",
      },
    ],
  },
];
