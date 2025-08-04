export const PLAN_LIMITS = {
    free: {
        maxProjects: 1,
        maxFiles: 5,
        maxTokens: 100000,
        allowedModels: ['gpt-3.5-turbo', "gemini-2.0-flash", "Kimi-K2-Instruct"],
    },
    pro: {
        maxProjects: 5,
        maxFiles: 50,
        maxTokens: 1000000,
        allowedModels: ['gpt-3.5-turbo', 'gpt-4', "gemini-2.0-flash", "Kimi-K2-Instruct"],
    },
    business: {
        maxProjects: 20,
        maxFiles: 500,
        maxTokens: 5000000,
        allowedModels: ['gpt-3.5-turbo', 'gpt-4', "gemini-2.0-flash", "Kimi-K2-Instruct"],
    }
};
