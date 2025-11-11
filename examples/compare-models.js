#!/usr/bin/env node

/**
 * Compare different AI models with the same prompt
 * 
 * Usage:
 *   1. Set your private key: export PRIVATE_KEY="0x..."
 *   2. Run: node compare-models.js
 */

import { withPaymentInterceptor } from 'x402-axios';
import axios from 'axios';
import { privateKeyToAccount } from 'viem/accounts';

if (!process.env.PRIVATE_KEY) {
  console.error('Error: PRIVATE_KEY environment variable not set');
  process.exit(1);
}

const MODELS = [
  { id: 'qwen', name: 'Qwen 3 Coder', strength: 'Code generation' },
  { id: 'glm-4.5', name: 'GLM 4.5', strength: 'Advanced reasoning' },
  { id: 'kimi', name: 'Kimi K2', strength: 'Long context' },
  { id: 'deepseek-v3.1', name: 'DeepSeek V3.1', strength: 'General chat' }
];

async function compareModels(prompt) {
  // Configure account with private key
  const account = privateKeyToAccount(process.env.PRIVATE_KEY);
  
  // Create client with payment interceptor
  const client = withPaymentInterceptor(
    axios.create({ baseURL: 'https://jatevo.ai' }),
    account
  );

  console.log('🔍 Testing prompt:', prompt);
  console.log('='.repeat(60));

  for (const model of MODELS) {
    try {
      console.log(`\n📊 ${model.name} (${model.strength}):`);
      console.log('-'.repeat(40));

      const start = Date.now();

      const response = await client.post(
        `/api/x402/llm/${model.id}`,
        {
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 150
        }
      );

      const elapsed = ((Date.now() - start) / 1000).toFixed(2);
      const content = response.data.choices[0].message.content;
      
      console.log(content);
      console.log(`\n⏱️  Response time: ${elapsed}s`);

    } catch (error) {
      console.error(`❌ ${model.name} failed:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Total cost: $${(MODELS.length * 0.01).toFixed(2)} USDC`);
}

// Example prompts to try
const prompts = {
  code: 'Write a Python function to find prime numbers',
  reasoning: 'If I have 3 apples and give away 40%, how many do I have?',
  creative: 'Write a haiku about artificial intelligence'
};

// Use command line argument or default prompt
const promptType = process.argv[2] || 'creative';
const prompt = prompts[promptType] || promptType;

compareModels(prompt).catch(console.error);
