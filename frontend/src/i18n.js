import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  pt: {
    translation: {
      // Navigation
      nav: {
        login: 'Entrar',
        getStarted: 'Começar',
        dashboard: 'Painel',
        workouts: 'Treinos',
        exercises: 'Exercícios',
        progress: 'Progresso',
        profile: 'Perfil',
        premium: 'Premium',
        goPremium: '⭐ Seja Premium',
        logout: 'Sair'
      },
      // Home page
      home: {
        title: 'Transforme Seu Corpo,',
        titleHighlight: 'Acompanhe Seu Progresso',
        subtitle: 'O melhor companheiro fitness para alcançar seus objetivos. Acompanhe treinos, monitore progresso e mantenha-se motivado.',
        startTrial: 'Comece Grátis',
        signIn: 'Entrar',
        whyChoose: 'Por Que Escolher MyWorkout?',
        features: {
          trackProgress: {
            title: 'Acompanhe Progresso',
            desc: 'Monitore ganhos de força, perda de peso e medidas corporais ao longo do tempo com gráficos e análises detalhadas.'
          },
          customWorkouts: {
            title: 'Treinos Personalizados',
            desc: 'Crie rotinas de treino personalizadas adaptadas aos seus objetivos, ou escolha entre centenas de programas pré-definidos.'
          },
          mobileReady: {
            title: 'Pronto para Mobile',
            desc: 'Acesse seus treinos em qualquer lugar, a qualquer hora. Funciona perfeitamente em todos os seus dispositivos, mesmo offline.'
          },
          goalSetting: {
            title: 'Definição de Metas',
            desc: 'Defina metas de fitness realistas e receba recomendações powered by IA para ajudá-lo a alcançá-las mais rápido.'
          },
          community: {
            title: 'Comunidade',
            desc: 'Participe de desafios, compartilhe progresso e mantenha-se motivado com uma comunidade fitness de apoio.'
          },
          premiumPlans: {
            title: 'Planos Premium',
            desc: 'Desbloqueie recursos avançados, coaching personalizado e programas de treino exclusivos de treinadores especialistas.'
          }
        },
        stats: {
          activeUsers: 'Usuários Ativos',
          workoutPrograms: 'Programas de Treino',
          workoutsLogged: 'Treinos Registrados',
          userRating: 'Avaliação de Usuários'
        },
        cta: {
          title: 'Pronto Para Começar Sua Jornada Fitness?',
          subtitle: 'Junte-se a milhares de usuários que já estão alcançando seus objetivos fitness',
          button: 'Comece Grátis'
        }
      },
      // Auth pages
      auth: {
        welcomeBack: 'Bem-vindo de Volta',
        signInSubtitle: 'Entre para continuar sua jornada fitness',
        createAccount: 'Criar Conta',
        registerSubtitle: 'Comece sua jornada fitness hoje',
        email: 'Email',
        password: 'Senha',
        confirmPassword: 'Confirmar Senha',
        fullName: 'Nome Completo',
        signIn: 'Entrar',
        signUp: 'Criar Conta',
        dontHaveAccount: 'Não tem uma conta?',
        alreadyHaveAccount: 'Já tem uma conta?',
        signingIn: 'Entrando...',
        creatingAccount: 'Criando conta...',
        fillAllFields: 'Preencha todos os campos',
        passwordsDontMatch: 'As senhas não coincidem',
        passwordTooShort: 'A senha deve ter pelo menos 6 caracteres'
      },
      // Dashboard
      dashboard: {
        welcomeBack: 'Bem-vindo de volta',
        subtitle: 'Aqui está sua visão geral de fitness',
        upgradePremium: '⭐ Atualize para Premium',
        stats: {
          totalWorkouts: 'Total de Treinos',
          thisWeek: 'Esta Semana',
          dayStreak: 'Sequência de Dias',
          exercisesDone: 'Exercícios Feitos'
        },
        quickActions: {
          title: 'Ações Rápidas',
          startWorkout: 'Iniciar Treino',
          startWorkoutDesc: 'Comece sua sessão de treino',
          browseExercises: 'Explorar Exercícios',
          browseExercisesDesc: 'Explore a biblioteca de exercícios',
          viewProgress: 'Ver Progresso',
          viewProgressDesc: 'Acompanhe suas melhorias'
        },
        recentWorkouts: {
          title: 'Treinos Recentes',
          viewAll: 'Ver Todos →',
          exercises: 'exercícios',
          noWorkouts: 'Nenhum treino ainda. Comece seu primeiro treino hoje!',
          createWorkout: 'Criar Treino'
        },
        premiumCta: {
          title: '🌟 Desbloqueie Recursos Premium',
          features: [
            '✓ Recomendações de treino powered by IA',
            '✓ Planos de treino personalizados',
            '✓ Análises de progresso avançadas',
            '✓ Rastreamento de nutrição',
            '✓ Programas de treino de especialistas'
          ],
          button: 'Seja Premium Agora'
        }
      },
      // Workouts page
      workouts: {
        title: 'Meus Treinos',
        subtitle: 'Crie e gerencie suas rotinas de treino',
        createCustom: '+ Criar Treino Personalizado',
        templates: 'Modelos de Treino',
        templatesSubtitle: 'Comece rápido com rotinas pré-construídas',
        myCustom: 'Meus Treinos Personalizados',
        useTemplate: 'Usar Modelo',
        noCustomWorkouts: 'Nenhum treino personalizado ainda. Crie seu primeiro!',
        createWorkoutTitle: 'Criar Treino Personalizado',
        workoutName: 'Nome do Treino',
        description: 'Descrição',
        cancel: 'Cancelar',
        create: 'Criar Treino'
      },
      // Exercises page
      exercises: {
        title: 'Biblioteca de Exercícios',
        subtitle: 'Explore nossa coleção abrangente de exercícios',
        search: 'Buscar exercícios...',
        showing: 'Mostrando',
        exercise: 'exercício',
        exercises: 'exercícios',
        addToWorkout: 'Adicionar ao Treino',
        categories: {
          all: 'Todos',
          chest: 'Peito',
          back: 'Costas',
          legs: 'Pernas',
          shoulders: 'Ombros',
          arms: 'Braços',
          core: 'Core',
          cardio: 'Cardio'
        },
        difficulty: {
          beginner: 'iniciante',
          intermediate: 'intermediário',
          advanced: 'avançado'
        }
      },
      // Progress page
      progress: {
        title: 'Seu Progresso',
        subtitle: 'Acompanhe sua jornada fitness e conquistas',
        weeklyGoal: 'Meta Semanal',
        workoutsThisWeek: 'treinos esta semana',
        goalAchieved: '🎉 Meta alcançada! Continue assim!',
        moreToGo: 'mais treino(s) para alcançar sua meta',
        activityCalendar: 'Calendário de Atividade',
        achievements: 'Conquistas',
        unlocked: '✓ Desbloqueado',
        avgDuration: 'Duração Média',
        totalWeight: 'Peso Total',
        topExercise: 'Exercício Principal'
      },
      // Profile page
      profile: {
        title: 'Configurações do Perfil',
        subtitle: 'Gerencie sua conta e preferências',
        editProfile: 'Editar Perfil',
        premiumMember: '⭐ Membro Premium',
        workouts: 'Treinos',
        daysActive: 'Dias Ativos',
        achievements: 'Conquistas',
        personalInfo: 'Informações Pessoais',
        fullName: 'Nome Completo',
        email: 'Email',
        age: 'Idade',
        weight: 'Peso (kg)',
        height: 'Altura (cm)',
        fitnessGoal: 'Meta de Fitness',
        experienceLevel: 'Nível de Experiência',
        goals: {
          strength: 'Construir Força',
          muscle: 'Ganhar Massa Muscular',
          weightLoss: 'Perder Peso',
          endurance: 'Melhorar Resistência',
          general: 'Fitness Geral'
        },
        experience: {
          beginner: 'Iniciante',
          intermediate: 'Intermediário',
          advanced: 'Avançado'
        },
        preferences: 'Preferências',
        emailNotifications: 'Notificações por Email',
        emailNotificationsDesc: 'Receba lembretes de treino e atualizações',
        weeklyReports: 'Relatórios Semanais',
        weeklyReportsDesc: 'Receba seu resumo semanal de progresso',
        socialSharing: 'Compartilhamento Social',
        socialSharingDesc: 'Permita que outros vejam suas conquistas',
        saveChanges: 'Salvar Alterações',
        cancel: 'Cancelar',
        darkMode: 'Modo Escuro',
        language: 'Idioma'
      },
      // Premium page
      premium: {
        title: 'Desbloqueie Seu Potencial Completo',
        subtitle: 'Junte-se a milhares de usuários que atualizaram para premium e alcançaram seus objetivos fitness',
        monthly: 'Mensal',
        annual: 'Anual',
        lifetime: 'Vitalício',
        month: '/mês',
        year: '/ano',
        oneTime: 'pagamento único',
        mostPopular: 'Mais Popular',
        bestValue: 'Melhor Valor',
        save: 'Economize 33%',
        allFeatures: '✓ Todos os Recursos Premium',
        cancelAnytime: '✓ Cancele a Qualquer Momento',
        moneyBack: '✓ Garantia de 30 Dias',
        upgrade: 'Atualizar para Premium',
        securePayment: '🔒 Pagamento seguro powered by Stripe',
        everythingIncluded: 'Tudo Incluído no Premium',
        testimonials: 'O Que Nossos Membros Premium Dizem',
        faq: 'Perguntas Frequentes',
        youArePremium: 'Você é um Membro Premium!',
        thankYou: 'Obrigado pelo seu apoio. Aproveite todos os recursos premium!',
        goToDashboard: 'Ir para o Painel'
      },
      // Common
      common: {
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        save: 'Salvar',
        cancel: 'Cancelar',
        delete: 'Excluir',
        edit: 'Editar',
        create: 'Criar',
        search: 'Buscar',
        filter: 'Filtrar',
        back: 'Voltar',
        next: 'Próximo',
        previous: 'Anterior',
        close: 'Fechar',
        confirm: 'Confirmar',
        calories: 'Calorias',
        water: 'Água',
        burned: 'queimadas',
        recommended: 'recomendados'
      },
      // Footer
      footer: {
        tagline: 'Seu companheiro fitness pessoal',
        quickLinks: 'Links Rápidos',
        support: 'Suporte',
        helpCenter: 'Central de Ajuda',
        contactUs: 'Fale Conosco',
        privacyPolicy: 'Política de Privacidade',
        allRightsReserved: 'Todos os direitos reservados.'
      }
    }
  },
  en: {
    translation: {
      nav: {
        login: 'Login',
        getStarted: 'Get Started',
        dashboard: 'Dashboard',
        workouts: 'Workouts',
        exercises: 'Exercises',
        progress: 'Progress',
        profile: 'Profile',
        premium: 'Premium',
        goPremium: '⭐ Go Premium',
        logout: 'Logout'
      },
      home: {
        title: 'Transform Your Body,',
        titleHighlight: 'Track Your Progress',
        subtitle: 'The ultimate fitness companion to help you achieve your goals. Track workouts, monitor progress, and stay motivated.',
        startTrial: 'Start Free Trial',
        signIn: 'Sign In',
        whyChoose: 'Why Choose MyWorkout?',
        features: {
          trackProgress: {
            title: 'Track Progress',
            desc: 'Monitor your strength gains, weight loss, and body measurements over time with detailed charts and analytics.'
          },
          customWorkouts: {
            title: 'Custom Workouts',
            desc: 'Create personalized workout routines tailored to your goals, or choose from hundreds of pre-made programs.'
          },
          mobileReady: {
            title: 'Mobile Ready',
            desc: 'Access your workouts anywhere, anytime. Works seamlessly on all your devices, even offline.'
          },
          goalSetting: {
            title: 'Goal Setting',
            desc: 'Set realistic fitness goals and get AI-powered recommendations to help you achieve them faster.'
          },
          community: {
            title: 'Community',
            desc: 'Join challenges, share progress, and stay motivated with a supportive fitness community.'
          },
          premiumPlans: {
            title: 'Premium Plans',
            desc: 'Unlock advanced features, personalized coaching, and exclusive workout programs from expert trainers.'
          }
        },
        stats: {
          activeUsers: 'Active Users',
          workoutPrograms: 'Workout Programs',
          workoutsLogged: 'Workouts Logged',
          userRating: 'User Rating'
        },
        cta: {
          title: 'Ready to Start Your Fitness Journey?',
          subtitle: 'Join thousands of users who are already achieving their fitness goals',
          button: 'Get Started Free'
        }
      },
      auth: {
        welcomeBack: 'Welcome Back',
        signInSubtitle: 'Sign in to continue your fitness journey',
        createAccount: 'Create Account',
        registerSubtitle: 'Start your fitness journey today',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        fullName: 'Full Name',
        signIn: 'Sign In',
        signUp: 'Create Account',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        signingIn: 'Signing in...',
        creatingAccount: 'Creating account...',
        fillAllFields: 'Please fill in all fields',
        passwordsDontMatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 6 characters'
      },
      dashboard: {
        welcomeBack: 'Welcome back',
        subtitle: "Here's your fitness overview",
        upgradePremium: '⭐ Upgrade to Premium',
        stats: {
          totalWorkouts: 'Total Workouts',
          thisWeek: 'This Week',
          dayStreak: 'Day Streak',
          exercisesDone: 'Exercises Done'
        },
        quickActions: {
          title: 'Quick Actions',
          startWorkout: 'Start Workout',
          startWorkoutDesc: 'Begin your training session',
          browseExercises: 'Browse Exercises',
          browseExercisesDesc: 'Explore exercise library',
          viewProgress: 'View Progress',
          viewProgressDesc: 'Track your improvements'
        },
        recentWorkouts: {
          title: 'Recent Workouts',
          viewAll: 'View All →',
          exercises: 'exercises',
          noWorkouts: 'No workouts yet. Start your first workout today!',
          createWorkout: 'Create Workout'
        },
        premiumCta: {
          title: '🌟 Unlock Premium Features',
          features: [
            '✓ AI-powered workout recommendations',
            '✓ Personalized training plans',
            '✓ Advanced progress analytics',
            '✓ Nutrition tracking',
            '✓ Expert workout programs'
          ],
          button: 'Go Premium Now'
        }
      },
      workouts: {
        title: 'My Workouts',
        subtitle: 'Create and manage your training routines',
        createCustom: '+ Create Custom Workout',
        templates: 'Workout Templates',
        templatesSubtitle: 'Quick start with pre-built routines',
        myCustom: 'My Custom Workouts',
        useTemplate: 'Use Template',
        noCustomWorkouts: 'No custom workouts yet. Create your first one!',
        createWorkoutTitle: 'Create Custom Workout',
        workoutName: 'Workout Name',
        description: 'Description',
        cancel: 'Cancel',
        create: 'Create Workout'
      },
      exercises: {
        title: 'Exercise Library',
        subtitle: 'Browse our comprehensive collection of exercises',
        search: 'Search exercises...',
        showing: 'Showing',
        exercise: 'exercise',
        exercises: 'exercises',
        addToWorkout: 'Add to Workout',
        categories: {
          all: 'All',
          chest: 'Chest',
          back: 'Back',
          legs: 'Legs',
          shoulders: 'Shoulders',
          arms: 'Arms',
          core: 'Core',
          cardio: 'Cardio'
        },
        difficulty: {
          beginner: 'beginner',
          intermediate: 'intermediate',
          advanced: 'advanced'
        }
      },
      progress: {
        title: 'Your Progress',
        subtitle: 'Track your fitness journey and achievements',
        weeklyGoal: 'Weekly Goal',
        workoutsThisWeek: 'workouts this week',
        goalAchieved: '🎉 Goal achieved! Keep it up!',
        moreToGo: 'more workout(s) to reach your goal',
        activityCalendar: 'Activity Calendar',
        achievements: 'Achievements',
        unlocked: '✓ Unlocked',
        avgDuration: 'Avg Duration',
        totalWeight: 'Total Weight',
        topExercise: 'Top Exercise'
      },
      profile: {
        title: 'Profile Settings',
        subtitle: 'Manage your account and preferences',
        editProfile: 'Edit Profile',
        premiumMember: '⭐ Premium Member',
        workouts: 'Workouts',
        daysActive: 'Days Active',
        achievements: 'Achievements',
        personalInfo: 'Personal Information',
        fullName: 'Full Name',
        email: 'Email',
        age: 'Age',
        weight: 'Weight (kg)',
        height: 'Height (cm)',
        fitnessGoal: 'Fitness Goal',
        experienceLevel: 'Experience Level',
        goals: {
          strength: 'Build Strength',
          muscle: 'Gain Muscle',
          weightLoss: 'Lose Weight',
          endurance: 'Improve Endurance',
          general: 'General Fitness'
        },
        experience: {
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced'
        },
        preferences: 'Preferences',
        emailNotifications: 'Email Notifications',
        emailNotificationsDesc: 'Receive workout reminders and updates',
        weeklyReports: 'Weekly Reports',
        weeklyReportsDesc: 'Get your weekly progress summary',
        socialSharing: 'Social Sharing',
        socialSharingDesc: 'Allow others to see your achievements',
        saveChanges: 'Save Changes',
        cancel: 'Cancel',
        darkMode: 'Dark Mode',
        language: 'Language'
      },
      premium: {
        title: 'Unlock Your Full Potential',
        subtitle: 'Join thousands of users who upgraded to premium and achieved their fitness goals',
        monthly: 'Monthly',
        annual: 'Annual',
        lifetime: 'Lifetime',
        month: '/month',
        year: '/year',
        oneTime: 'one-time',
        mostPopular: 'Most Popular',
        bestValue: 'Best Value',
        save: 'Save 33%',
        allFeatures: '✓ All Premium Features',
        cancelAnytime: '✓ Cancel Anytime',
        moneyBack: '✓ 30-Day Money Back',
        upgrade: 'Upgrade to Premium',
        securePayment: '🔒 Secure payment powered by Stripe',
        everythingIncluded: 'Everything Included in Premium',
        testimonials: 'What Our Premium Members Say',
        faq: 'Frequently Asked Questions',
        youArePremium: "You're a Premium Member!",
        thankYou: 'Thank you for your support. Enjoy all premium features!',
        goToDashboard: 'Go to Dashboard'
      },
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        search: 'Search',
        filter: 'Filter',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        confirm: 'Confirm',
        calories: 'Calories',
        water: 'Water',
        burned: 'burned',
        recommended: 'recommended'
      },
      footer: {
        tagline: 'Your personal fitness companion',
        quickLinks: 'Quick Links',
        support: 'Support',
        helpCenter: 'Help Center',
        contactUs: 'Contact Us',
        privacyPolicy: 'Privacy Policy',
        allRightsReserved: 'All rights reserved.'
      }
    }
  }
}

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n
