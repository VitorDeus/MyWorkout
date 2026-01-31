import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Specialized AI Agent System for MyWorkout
 * Each agent is an expert in a specific domain of fitness
 */

class SpecializedAgents {
  constructor() {
    this.model = 'llama-3.3-70b-versatile';
    this.temperature = 0.7;
  }

  /**
   * 🏋️ PERSONAL TRAINER AGENT
   * Expert in workout programming, exercise selection, and training methodology
   */
  async personalTrainerAgent(userContext, question) {
    const systemPrompt = `Você é um PERSONAL TRAINER EXPERT com certificação internacional e 15 anos de experiência.

ESPECIALIZAÇÃO:
- Periodização e programação de treinos
- Seleção e progressão de exercícios
- Volume, intensidade e frequência de treinamento
- Técnicas de execução e biomecânica
- Prevenção de plateaus e overtraining

CONTEXTO DO USUÁRIO:
- Peso: ${userContext.weight}kg
- Altura: ${userContext.height}cm
- Objetivo: ${userContext.fitnessGoal}
- Nível: ${userContext.experienceLevel}
- Histórico: ${userContext.workoutHistory?.length || 0} treinos realizados

INSTRUÇÕES:
- Forneça planos de treino específicos e detalhados
- Base suas recomendações em princípios científicos
- Inclua progressão clara (séries, reps, carga, RIR)
- Considere o nível de experiência do usuário
- Seja específico com nomes de exercícios e técnicas`;

    return await this._callGroq(systemPrompt, question, 'personal_trainer', '🏋️');
  }

  /**
   * 🍎 NUTRITION COACH AGENT
   * Expert in nutrition science, meal planning, and dietary strategies
   */
  async nutritionCoachAgent(userContext, question) {
    const systemPrompt = `Você é um NUTRICIONISTA ESPORTIVO com especialização em performance atlética.

ESPECIALIZAÇÃO:
- Cálculo de macros e micronutrientes
- Timing de nutrientes (pré/pós treino)
- Estratégias de cutting/bulking
- Suplementação baseada em evidências
- Hidratação e reposição eletrolítica

CONTEXTO DO USUÁRIO:
- Peso: ${userContext.weight}kg
- Altura: ${userContext.height}cm
- Objetivo: ${userContext.fitnessGoal}
- Nível de atividade: ${userContext.experienceLevel}
- TMB estimado: ${this._calculateBMR(userContext)} kcal

INSTRUÇÕES:
- Calcule necessidades calóricas específicas
- Forneça distribuição de macros (proteína, carbo, gordura)
- Sugira timing de refeições em relação aos treinos
- Recomende fontes alimentares de qualidade
- Seja prático e aplicável ao dia-a-dia`;

    return await this._callGroq(systemPrompt, question, 'nutrition_coach', '🍎');
  }

  /**
   * 💪 RECOVERY COACH AGENT
   * Expert in recovery strategies, injury prevention, and fatigue management
   */
  async recoveryCoachAgent(userContext, question) {
    const systemPrompt = `Você é um ESPECIALISTA EM RECUPERAÇÃO E PREVENÇÃO DE LESÕES.

ESPECIALIZAÇÃO:
- Gestão de fadiga e recuperação
- Prevenção de lesões e overtraining
- Técnicas de recuperação ativa/passiva
- Mobilidade e flexibilidade
- Periodização de deload weeks

CONTEXTO DO USUÁRIO:
- Nível: ${userContext.experienceLevel}
- Frequência treino: ${userContext.workoutHistory?.length || 0} treinos registrados
- Objetivo: ${userContext.fitnessGoal}

INSTRUÇÕES:
- Identifique sinais de overtraining ou fadiga
- Recomende estratégias de recuperação específicas
- Sugira protocolos de mobilidade e alongamento
- Oriente sobre sono e gerenciamento de estresse
- Previna lesões com exercícios corretivos`;

    return await this._callGroq(systemPrompt, question, 'recovery_coach', '💪');
  }

  /**
   * 📊 PERFORMANCE ANALYST AGENT
   * Expert in data analysis, progress tracking, and metric interpretation
   */
  async performanceAnalystAgent(userContext, question, workoutData = {}) {
    const systemPrompt = `Você é um ANALISTA DE PERFORMANCE FITNESS especializado em métricas e dados.

ESPECIALIZAÇÃO:
- Análise de progressão de carga e volume
- Interpretação de métricas de performance
- Identificação de pontos fortes e fracos
- Recomendações baseadas em dados
- Tracking de KPIs (força, resistência, composição)

CONTEXTO DO USUÁRIO:
- Objetivo: ${userContext.fitnessGoal}
- Nível: ${userContext.experienceLevel}

DADOS DE TREINO:
- Total treinos: ${workoutData.totalWorkouts || 0}
- Calorias queimadas: ${workoutData.totalCalories || 0} kcal
- Frequência semanal: ${workoutData.weeklyFrequency || 0} dias
- Última semana: ${workoutData.lastWeekWorkouts || 0} treinos

INSTRUÇÕES:
- Analise os dados objetivamente
- Identifique tendências e padrões
- Compare com benchmarks do nível de experiência
- Forneça métricas acionáveis
- Sugira ajustes baseados em dados`;

    return await this._callGroq(systemPrompt, question, 'performance_analyst', '📊');
  }

  /**
   * 🧠 MOTIVATION COACH AGENT
   * Expert in psychology, habit formation, and motivation strategies
   */
  async motivationCoachAgent(userContext, question) {
    const systemPrompt = `Você é um COACH DE MOTIVAÇÃO E PSICOLOGIA DO ESPORTE.

ESPECIALIZAÇÃO:
- Psicologia da mudança comportamental
- Formação de hábitos sustentáveis
- Gerenciamento de expectativas
- Superação de barreiras mentais
- Estratégias de aderência a longo prazo

CONTEXTO DO USUÁRIO:
- Objetivo: ${userContext.fitnessGoal}
- Experiência: ${userContext.experienceLevel}
- Consistência: ${userContext.workoutHistory?.length || 0} treinos completados

INSTRUÇÕES:
- Seja empático e encorajador
- Forneça estratégias psicológicas práticas
- Ajude a definir metas realistas e progressivas
- Aborde bloqueios mentais e falta de motivação
- Foque na sustentabilidade e prazer no processo`;

    return await this._callGroq(systemPrompt, question, 'motivation_coach', '🧠');
  }

  /**
   * INTELLIGENT AGENT ROUTER
   * Routes questions to the most appropriate specialized agent(s)
   */
  async routeQuestion(userContext, question, workoutData = {}) {
    // Analyze question to determine which agent(s) to use
    const questionLower = question.toLowerCase();
    
    // Keywords for each agent
    const keywords = {
      personalTrainer: ['treino', 'exercício', 'série', 'repetição', 'carga', 'volume', 'frequência', 'split', 'dividir', 'programa'],
      nutrition: ['dieta', 'comida', 'calorias', 'proteína', 'carbo', 'gordura', 'macro', 'nutrição', 'suplemento', 'refeição'],
      recovery: ['recuperação', 'descanso', 'lesão', 'dor', 'fadiga', 'overtraining', 'mobilidade', 'alongamento', 'sono'],
      performance: ['progresso', 'resultado', 'análise', 'métrica', 'dados', 'performance', 'evolução', 'comparar'],
      motivation: ['motivação', 'desânimo', 'hábito', 'consistência', 'mentalidade', 'objetivo', 'foco', 'disciplina']
    };

    const matchedAgents = [];
    
    // Check which agents match the question
    if (keywords.personalTrainer.some(kw => questionLower.includes(kw))) {
      matchedAgents.push('personalTrainer');
    }
    if (keywords.nutrition.some(kw => questionLower.includes(kw))) {
      matchedAgents.push('nutrition');
    }
    if (keywords.recovery.some(kw => questionLower.includes(kw))) {
      matchedAgents.push('recovery');
    }
    if (keywords.performance.some(kw => questionLower.includes(kw))) {
      matchedAgents.push('performance');
    }
    if (keywords.motivation.some(kw => questionLower.includes(kw))) {
      matchedAgents.push('motivation');
    }

    // If no specific match, use personal trainer as default
    if (matchedAgents.length === 0) {
      matchedAgents.push('personalTrainer');
    }

    console.log(`🎯 Routing to agents: ${matchedAgents.join(', ')}`);

    // Call matched agents
    const responses = [];
    
    for (const agentType of matchedAgents) {
      let response;
      switch (agentType) {
        case 'personalTrainer':
          response = await this.personalTrainerAgent(userContext, question);
          break;
        case 'nutrition':
          response = await this.nutritionCoachAgent(userContext, question);
          break;
        case 'recovery':
          response = await this.recoveryCoachAgent(userContext, question);
          break;
        case 'performance':
          response = await this.performanceAnalystAgent(userContext, question, workoutData);
          break;
        case 'motivation':
          response = await this.motivationCoachAgent(userContext, question);
          break;
      }
      responses.push(response);
    }

    return {
      question,
      agents: responses,
      routedTo: matchedAgents,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * COMPREHENSIVE CONSULTATION
   * Get insights from multiple relevant agents for complex questions
   */
  async comprehensiveConsultation(userContext, question, workoutData = {}) {
    console.log('🤖 Starting comprehensive multi-agent consultation...');
    
    try {
      // Get responses from top 3 most relevant agents
      const trainerResponse = await this.personalTrainerAgent(userContext, question);
      const nutritionResponse = await this.nutritionCoachAgent(userContext, question);
      const performanceResponse = await this.performanceAnalystAgent(userContext, question, workoutData);

      return {
        question,
        agents: [trainerResponse, nutritionResponse, performanceResponse],
        consultationType: 'comprehensive',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Comprehensive consultation error:', error);
      throw error;
    }
  }

  /**
   * Helper: Call Groq API
   */
  async _callGroq(systemPrompt, userMessage, agentType, icon) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        model: this.model,
        temperature: this.temperature,
        max_tokens: 1024
      });

      return {
        agent: agentType,
        response: completion.choices[0]?.message?.content || '',
        icon: icon
      };
    } catch (error) {
      console.error(`${agentType} error:`, error);
      throw error;
    }
  }

  /**
   * Helper: Calculate Basal Metabolic Rate
   */
  _calculateBMR(userContext) {
    // Mifflin-St Jeor Equation
    const weight = userContext.weight || 70;
    const height = userContext.height || 170;
    const age = userContext.age || 30;
    const gender = userContext.gender || 'male';

    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    return Math.round(bmr);
  }
}

// Export singleton instance
export default new SpecializedAgents();
