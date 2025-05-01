interface FAQStats {
  totalQuestions: number;
  totalViews: number;
  helpfulResponses: number;
  categoryStats: {
    [key: string]: {
      views: number;
      helpfulResponses: number;
    };
  };
}

// Inicializa as estatísticas no localStorage se não existirem
const initializeStats = () => {
  const stats = localStorage.getItem('faqStats');
  if (!stats) {
    const initialStats: FAQStats = {
      totalQuestions: 0,
      totalViews: 0,
      helpfulResponses: 0,
      categoryStats: {}
    };
    localStorage.setItem('faqStats', JSON.stringify(initialStats));
    return initialStats;
  }
  return JSON.parse(stats);
};

// Registra uma visualização de pergunta
export const recordQuestionView = (category: string) => {
  const stats = initializeStats();
  
  // Incrementa visualizações totais
  stats.totalViews += 1;
  
  // Incrementa visualizações da categoria
  if (!stats.categoryStats[category]) {
    stats.categoryStats[category] = {
      views: 0,
      helpfulResponses: 0
    };
  }
  stats.categoryStats[category].views += 1;
  
  localStorage.setItem('faqStats', JSON.stringify(stats));
};

// Registra um feedback de resposta
export const recordFeedback = (category: string, isHelpful: boolean) => {
  const stats = initializeStats();
  
  if (isHelpful) {
    stats.helpfulResponses += 1;
    if (stats.categoryStats[category]) {
      stats.categoryStats[category].helpfulResponses += 1;
    }
  }
  
  localStorage.setItem('faqStats', JSON.stringify(stats));
};

// Obtém as estatísticas atuais
export const getStats = (): FAQStats => {
  return initializeStats();
};

// Obtém as categorias mais populares
export const getPopularCategories = (categories: string[]) => {
  const stats = initializeStats();
  
  return categories.map(category => ({
    category,
    views: stats.categoryStats[category]?.views || 0,
    helpfulResponses: stats.categoryStats[category]?.helpfulResponses || 0
  })).sort((a, b) => b.views - a.views);
}; 