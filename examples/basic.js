#!/usr/bin/env node

/**
 * Basic example for calling Jatevo LLM API from terminal/VSCode
 * 
 * Usage:
 *   1. Set your private key: export PRIVATE_KEY="0x..."
 *   2. Run: node basic.js
 */

import { withPaymentInterceptor } from 'x402-axios';
import axios from 'axios';
import { privateKeyToAccount } from 'viem/accounts';

// Check for private key
if (!process.env.PRIVATE_KEY) {
  console.error('Error: PRIVATE_KEY environment variable not set');
  console.error('Set it with: export PRIVATE_KEY="0x..."');
  process.exit(1);
}

async function main() {
  // Configure account with private key
  const account = privateKeyToAccount(process.env.PRIVATE_KEY);
  
  // Create client with payment interceptor
  const client = withPaymentInterceptor(
    axios.create({ baseURL: 'https://jatevo.ai' }),
    account
  );

  try {
    console.log('🚀 Calling Qwen model...\n');

    // Make API request
    const response = await client.post('/api/x402/llm/qwen', {
      messages: [
        {
          role: 'user',
          content: 'Write a haiku about programming'
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    // Display response
    console.log('📝 Response:');
    console.log(response.data.choices[0].message.content);
    console.log('\n✅ Success! Cost: $0.01 USDC');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.response?.status === 402) {
      console.error('\n💡 Tip: Check your USDC balance on Base network');
    }
  }
}

// Run the example
main();
