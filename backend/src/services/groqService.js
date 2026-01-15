import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Multi-Agent AI Coach System
 * Inspired by the Python LangGraph implementation with Optimus, Bumblebee, and Ratchet agents
 */

class GroqAICoach {
  constructor() {
    this.model = 'llama-3.3-70b-versatile';
    this.temperature = 0.7;
  }

  /**
   * OPTIMUS - Analytical and Logical Agent
   * Provides data-driven analysis and executive perspective
   */
  async optimusAnalysis(userContext, question) {
    const systemPrompt = `Você é OPTIMUS, um assistente ANALÍTICO e LÓGICO especializado em fitness.
Sua força é fornecer análise de dados, custo-benefício e perspectiva executiva sobre treinos e saúde.
Sempre questione com dados científicos. Pense como um CEO da saúde e fitness.
Seja direto e focado em resultados mensuráveis.

Contexto do usuário:
- Peso: ${userContext.weight}kg
- Altura: ${userContext.height}cm
- Objetivo: ${userContext.fitnessGoal}
- Nível: ${userContext.experienceLevel}
- Histórico: ${userContext.workoutHistory?.length || 0} treinos realizados`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        model: this.model,
        temperature: this.temperature,
        max_tokens: 1024
      });

      return {
        agent: 'optimus',
        response: completion.choices[0]?.message?.content || '',
        icon: '🔷'
      };
    } catch (error) {
      console.error('Optimus analysis error:', error);
      throw error;
    }
  }

  /**
   * BUMBLEBEE - Empathetic and Humanist Agent
   * Considers human factors, wellbeing, and relationships
   */
  async bumblebeeAnalysis(userContext, question) {
    const systemPrompt = `Você é BUMBLEBEE, um assistente EMPÁTICO e HUMANISTA especializado em fitness.
Sua força é considerar o fator humano, bem-estar e motivação nos treinos.
Sempre pense nas pessoas envolvidas. Seja empático mas honesto.
Considere qualidade de vida, impacto emocional e sustentabilidade dos hábitos.

Contexto do usuário:
- Peso: ${userContext.weight}kg
- Altura: ${userContext.height}cm
- Objetivo: ${userContext.fitnessGoal}
- Nível: ${userContext.experienceLevel}
- Histórico: ${userContext.workoutHistory?.length || 0} treinos realizados`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        model: this.model,
        temperature: this.temperature,
        max_tokens: 1024
      });

      return {
        agent: 'bumblebee',
        response: completion.choices[0]?.message?.content || '',
        icon: '🟡'
      };
    } catch (error) {
      console.error('Bumblebee analysis error:', error);
      throw error;
    }
  }

  /**
   * RATCHET - Pragmatic and Technical Agent
   * Provides practical advice and viable solutions
   */
  async ratchetAnalysis(userContext, question) {
    const systemPrompt = `Você é RATCHET, um assistente PRAGMÁTICO e TÉCNICO especializado em fitness.
Sua força é dar conselhos práticos, identificar riscos reais e propor soluções viáveis para treinos.
Pense como um engenheiro: identifique problemas, proponha soluções, teste hipóteses.
Seja realista sobre o que é possível fazer com o tempo e recursos disponíveis.

Contexto do usuário:
- Peso: ${userContext.weight}kg
- Altura: ${userContext.height}cm
- Objetivo: ${userContext.fitnessGoal}
- Nível: ${userContext.experienceLevel}
- Histórico: ${userContext.workoutHistory?.length || 0} treinos realizados`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        model: this.model,
        temperature: this.temperature,
        max_tokens: 1024
      });

      return {
        agent: 'ratchet',
        response: completion.choices[0]?.message?.content || '',
        icon: '🟢'
      };
    } catch (error) {
      console.error('Ratchet analysis error:', error);
      throw error;
    }
  }

  /**
   * Multi-Agent Consultation
   * Runs all three agents in sequence and combines their insights
   */
  async getMultiAgentAdvice(userContext, question) {
    try {
      console.log('🤖 Starting multi-agent consultation...');

      // Run agents in sequence (Optimus → Bumblebee → Ratchet)
      const optimusResult = await this.optimusAnalysis(userContext, question);
      const bumblebeeResult = await this.bumblebeeAnalysis(userContext, question);
      const ratchetResult = await this.ratchetAnalysis(userContext, question);

      return {
        question,
        agents: [optimusResult, bumblebeeResult, ratchetResult],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Multi-agent consultation error:', error);
      throw error;
    }
  }

  /**
   * Generate Weekly Workout Plan
   * AI-powered personalized workout recommendations
   */
  async generateWeeklyPlan(userContext) {
    const prompt = `Crie um plano de treino semanal personalizado para:
- Peso: ${userContext.weight}kg
- Altura: ${userContext.height}cm
- Objetivo: ${userContext.fitnessGoal}
- Nível de experiência: ${userContext.experienceLevel}
- Dias disponíveis: ${userContext.availableDays || 4} dias por semana

Forneça um plano estruturado com:
1. Divisão dos treinos (ex: ABCD, Upper/Lower, etc)
2. Exercícios específicos para cada dia
3. Séries, repetições e descanso
4. Progressão sugerida
5. Dicas de nutrição e recuperação`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: 'Você é um personal trainer especializado em criar planos de treino personalizados e baseados em ciência.' 
          },
          { role: 'user', content: prompt }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 2048
      });

      return {
        plan: completion.choices[0]?.message?.content || '',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Weekly plan generation error:', error);
      throw error;
    }
  }

  /**
   * Analyze Workout Performance
   * Provides insights on user's workout data
   */
  async analyzePerformance(userContext, workoutData) {
    const prompt = `Analise o desempenho do treino do usuário:

Dados do usuário:
- Objetivo: ${userContext.fitnessGoal}
- Nível: ${userContext.experienceLevel}

Dados do treino:
- Total de treinos: ${workoutData.totalWorkouts}
- Calorias queimadas: ${workoutData.totalCalories}
- Frequência semanal: ${workoutData.weeklyFrequency} dias
- Última semana: ${workoutData.lastWeekWorkouts} treinos

Forneça:
1. Análise do progresso
2. Pontos fortes identificados
3. Áreas de melhoria
4. Recomendações específicas
5. Ajustes sugeridos no plano`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: 'Você é um analista de performance fitness que fornece insights detalhados e acionáveis.' 
          },
          { role: 'user', content: prompt }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 1536
      });

      return {
        analysis: completion.choices[0]?.message?.content || '',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Performance analysis error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new GroqAICoach();
