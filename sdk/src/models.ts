import { ModelInfo, ModelType } from './types';

export const MODELS: Record<ModelType, ModelInfo> = {
  'qwen': {
    id: 'qwen',
    name: 'Qwen 3 Coder 480B',
    description: 'Advanced code generation and analysis model',
    endpoint: '/api/x402/llm/qwen',
    price: '$0.01',
    priceInMicroUSDC: 10000
  },
  'glm': {
    id: 'glm',
    name: 'GLM 4.5 (deprecated alias)',
    description: 'Advanced reasoning and problem-solving model. Use "glm-4.5" or "glm-4.6" instead.',
    endpoint: '/api/x402/llm/glm-4.5',
    price: '$0.01',
    priceInMicroUSDC: 10000
  },
  'glm-4.5': {
    id: 'glm-4.5',
    name: 'GLM 4.5',
    description: 'Advanced Chinese-English bilingual model for high-quality text generation',
    endpoint: '/api/x402/llm/glm-4.5',
    price: '$0.01',
    priceInMicroUSDC: 10000
  },
  'glm-4.6': {
    id: 'glm-4.6',
    name: 'GLM 4.6',
    description: 'Latest generation Chinese-English bilingual model with enhanced reasoning capabilities',
    endpoint: '/api/x402/llm/glm-4.6',
    price: '$0.01',
    priceInMicroUSDC: 10000
  },
  'kimi': {
    id: 'kimi',
    name: 'Kimi K2',
    description: 'Long context understanding and analysis',
    endpoint: '/api/x402/llm/kimi',
    price: '$0.01',
    priceInMicroUSDC: 10000
  },
  'deepseek-r1-0528': {
    id: 'deepseek-r1-0528',
    name: 'DeepSeek R1 0528',
    description: 'Latest reasoning model with online capabilities',
    endpoint: '/api/x402/llm/deepseek-r1-0528',
    price: '$0.01',
    priceInMicroUSDC: 10000
  },
  'deepseek-v3.1': {
    id: 'deepseek-v3.1',
    name: 'DeepSeek V3.1',
    description: 'Efficient chat model with competitive performance',
    endpoint: '/api/x402/llm/deepseek-v3.1',
    price: '$0.01',
    priceInMicroUSDC: 10000
  },
  'gpt-oss': {
    id: 'gpt-oss',
    name: 'GPT-OSS',
    description: 'OpenAI\'s efficient model for general tasks',
    endpoint: '/api/x402/llm/gpt-oss',
    price: '$0.01',
    priceInMicroUSDC: 10000
  }
};

export function getModel(modelId: ModelType): ModelInfo {
  const model = MODELS[modelId];
  if (!model) {
    throw new Error(`Unknown model: ${modelId}`);
  }
  return model;
}

export function listModels(): ModelInfo[] {
  return Object.values(MODELS);
}