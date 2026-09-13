import { ecologicalProblems } from "./quests";
import type { EcologicalProblem, Quest } from "../types";

export type JourneyQuest = Quest & {
  id: string;
  problemId: string;
  problemTitle: string;
};

export type JourneyMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export type JourneyAchievement = {
  id: string;
  title: string;
  description: string;
  icon: "leaf" | "star" | "recycle" | "drop";
  unlocked: boolean;
};

export const questCatalog: JourneyQuest[] = ecologicalProblems.flatMap(
  (problem) =>
    problem.quests.map((quest, index) => ({
      ...quest,
      id: `${problem.id}-${quest.dificuldade}-${index}`,
      problemId: problem.id,
      problemTitle: problem.titulo,
    })),
);

export function getJourneyAchievements(
  completedIds: readonly string[],
): JourneyAchievement[] {
  const completed = questCatalog.filter((quest) =>
    completedIds.includes(quest.id),
  );
  return [
    {
      id: "first-step",
      title: "Primeiro passo",
      description: "Conclua sua primeira missão sustentável.",
      icon: "star",
      unlocked: completed.length > 0,
    },
    {
      id: "green-habit",
      title: "Em evolução",
      description:
        "Conclua cinco missões e comece a criar um hábito sustentável.",
      icon: "leaf",
      unlocked: completed.length >= 5,
    },
    {
      id: "recycling",
      title: "Novo ciclo",
      description:
        "Conclua uma missão de resíduos e ajude a reduzir o descarte incorreto.",
      icon: "recycle",
      unlocked: completed.some((quest) => quest.problemId === "residuos"),
    },
    {
      id: "water",
      title: "Cada gota conta",
      description:
        "Conclua uma missão de água e contribua para o uso consciente do recurso.",
      icon: "drop",
      unlocked: completed.some((quest) => quest.problemId === "agua"),
    },
  ];
}

type ReplyContext = {
  userName: string;
  points: number;
  completedIds: readonly string[];
  currentProblem: EcologicalProblem;
  activeQuest: JourneyQuest | null;
  recommendedQuest: JourneyQuest | null;
};

export function getJourneyReply(input: string, context: ReplyContext): string {
  const text = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const {
    userName,
    points,
    completedIds,
    currentProblem,
    activeQuest,
    recommendedQuest,
  } = context;
  const count = questCatalog.filter((quest) =>
    completedIds.includes(quest.id),
  ).length;
  const suggestion = recommendedQuest
    ? `Uma sugestão: “${recommendedQuest.titulo}”. ${recommendedQuest.tempo}, no seu ritmo.`
    : "Você concluiu todas as missões disponíveis. Pode revisitar os hábitos que mais gostou!";

  if (
    /\b(desanimad[oa]|cansad[oa]|triste|ansios[oa]|sem energia|sem motivacao|dificil|nao consigo|incentivo|motive|motivacao|inspire|inspiracao)\b/.test(
      text,
    )
  ) {
    return `Tudo bem ir devagar, ${userName}. Uma pequena ação já tem valor. ${activeQuest ? "Sua missão pode esperar; retome quando fizer sentido para você." : suggestion}`;
  }
  if (/\b(conclui|terminei|finalizei|feito|ja fiz|completei)\b/.test(text)) {
    return activeQuest
      ? `Se você já realizou “${activeQuest.titulo}”, use “Já fiz! Concluir missão” no cartão para confirmar e receber ${activeQuest.pontos} XP. Eu comemoro com você!`
      : "Escolha uma missão e comece pelo cartão. Depois de realizar a ação, você pode confirmar sua conclusão por lá.";
  }
  if (/\b(progresso|pontos|xp|nivel|evolucao|quantas|quantos)\b/.test(text)) {
    return count === 0
      ? `Você tem ${points} XP e sua primeira missão está esperando. ${suggestion}`
      : `Você já concluiu ${count} ${count === 1 ? "missão" : "missões"} e tem ${points} XP! ${activeQuest ? `Seu próximo passo é “${activeQuest.titulo}”.` : suggestion}`;
  }
  if (
    /\b(conquista|conquistas|recompensa|recompensas|premio|premios|desconto|trocar)\b/.test(
      text,
    )
  ) {
    const unlocked = getJourneyAchievements(completedIds).filter(
      (achievement) => achievement.unlocked,
    );
    return `${unlocked.length ? `Você desbloqueou: ${unlocked.map((achievement) => achievement.title).join(", ")}.` : "A primeira conquista vem com sua primeira missão concluída."} As recompensas aqui são XP, níveis e conquistas da sua jornada; não há resgate de prêmios.`;
  }
  if (
    /\b(missao|missoes|comecar|comeco|sugestao|sugira|recomenda|ajuda|objetivo|o que fazer)\b/.test(
      text,
    )
  ) {
    return activeQuest
      ? `Sua missão é “${activeQuest.titulo}”. ${activeQuest.descricao} Quando realizar a ação, confirme pelo cartão da missão.`
      : `${suggestion} Use “Começar missão” para ver o passo a passo.`;
  }
  if (
    /\b(oi|ola|bom dia|boa tarde|boa noite|tudo bem|quem e voce|seu nome)\b/.test(
      text,
    )
  ) {
    return `Olá, ${userName}! Eu sou o Nexo, seu parceiro de evolução. Posso sugerir uma missão, acompanhar seu progresso ou explicar o tema que você escolheu.`;
  }
  if (/\b(obrigad[oa]|valeu|adorei|legal|parabens)\b/.test(text)) {
    return "É bom caminhar com você! Cada hábito que você coloca em prática faz a jornada seguir em frente.";
  }
  const topics: Array<[string, RegExp]> = [
    ["agua", /\b(agua|banho|torneira|vazamento)\b/],
    ["residuos", /\b(residuo|residuos|lixo|reciclagem|reciclar|reutilizar)\b/],
    ["clima", /\b(clima|energia|carbono|transporte|emissao|emissoes)\b/],
    [
      "biodiversidade",
      /\b(biodiversidade|planta|plantas|natureza|arvore|arvores)\b/,
    ],
    ["poluicao", /\b(poluicao|descartavel|descartaveis|fumaca)\b/],
  ];
  const topic = topics.find(([, pattern]) => pattern.test(text));
  if (
    topic ||
    /\b(tema|ambiente|impacto|explique|explica|sustentabilidade)\b/.test(text)
  ) {
    const problem =
      ecologicalProblems.find((item) => item.id === topic?.[0]) ??
      currentProblem;
    return `${problem.resumo} Você encontra ações sobre isso no tema “${problem.titulo}”.`;
  }
  return `Ainda não tenho uma resposta para isso. Minha conversa é guiada por missões e hábitos sustentáveis. Você pode pedir uma sugestão, consultar seu progresso ou conversar sobre ${currentProblem.titulo.toLowerCase()}.`;
}
