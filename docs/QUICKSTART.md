# Quick Start Guide

Get started with JATEVO x402 AI Inference API in under 5 minutes. Now with dual-network support for both Base and Solana!

## Prerequisites

- Node.js 18+ or Python 3.8+
- Choose your network:
  - **Base Network**: Ethereum wallet with ETH for gas (~$0.50) and USDC for payments
  - **Solana Network**: Solana wallet with SOL for gas (~$0.01) and USDC for payments
- Your wallet's private key (Base) or keypair (Solana)

## Step 1: Get Your Wallet Ready

### For Base Network

#### Option A: Use an Existing Wallet

Export your private key from MetaMask or another wallet:
1. Open MetaMask
2. Click account menu → Account Details
3. Export Private Key (requires password)

#### Option B: Create a New Wallet

```bash
# Using ethers.js
npx ethers-cli create-wallet

# Or use any Ethereum wallet tool
```

#### Add Funds to Base Network

1. Bridge ETH to Base: https://bridge.base.org
2. Swap some ETH for USDC on Base (use Uniswap or similar)

Recommended minimum:
- 0.01 ETH (~$20) for gas
- 1 USDC for testing (~100 requests)

### For Solana Network

#### Option A: Use Phantom Wallet (Browser)

1. Install [Phantom Wallet](https://phantom.app)
2. Create or import a wallet
3. Fund with SOL and USDC

#### Option B: Create a Keypair (Server)

```bash
# Using Solana CLI
solana-keygen new --outfile ./solana-keypair.json

# Or generate in code
```

#### Add Funds to Solana

1. Transfer USDC from exchange (Coinbase, Binance, etc.)
2. Or swap SOL for USDC on [Jupiter](https://jup.ag)

Recommended minimum:
- 0.01 SOL (~$2) for gas
- 1 USDC for testing (~100 requests)

## Step 2: Install Dependencies

### JavaScript/TypeScript

```bash
# Install the official SDK with dual-network support
npm install jatevo-x402-sdk
# or
pnpm install jatevo-x402-sdk

# For legacy Base-only implementation
npm install x402-axios axios viem dotenv
```

### Python (coming soon)

```bash
pip install x402-python
```

## Step 3: Set Up Environment

Create a `.env` file:

```bash
# For Base Network
PRIVATE_KEY=0x...  # Your Base wallet private key

# For Solana Network  
SOLANA_KEYPAIR_PATH=./solana-keypair.json  # Path to keypair file
# Or for browser apps, no env needed (uses Phantom)
```

⚠️ **Security**: Never commit `.env` or keypair files to git. Add them to `.gitignore`.

## Step 4: Make Your First Request

### Using the SDK - Base Network

Create `test-base.ts`:

```typescript
import 'dotenv/config';
import { X402Client } from 'jatevo-x402-sdk';

const client = new X402Client({
  baseUrl: 'https://jatevo.ai',
  network: 'base',
  privateKey: process.env.PRIVATE_KEY,
  debug: true
});

async function main() {
  const response = await client.chat('qwen', 'Say hello!');
  console.log(response);
}

main();
```

### Using the SDK - Solana Network

Create `test-solana.ts`:

```typescript
import 'dotenv/config';
import { X402Client } from 'jatevo-x402-sdk';
import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';

// Load keypair
const secretKey = JSON.parse(fs.readFileSync('./solana-keypair.json', 'utf-8'));
const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

const client = new X402Client({
  baseUrl: 'https://jatevo.ai',
  network: 'solana',
  solanaWallet: keypair,
  debug: true
});

async function main() {
  const response = await client.chat('qwen', 'Say hello!');
  console.log(response);
}

main();
```

Run either:

```bash
npx tsx test-base.ts    # For Base network
npx tsx test-solana.ts  # For Solana network
```

## Step 5: Understanding the Response

You'll get an OpenAI-compatible response:

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "qwen-3-coder-480b",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 12,
    "total_tokens": 22
  }
}
```

The payment happened automatically via x402! Check the transaction on Base: https://basescan.org

## Common Patterns

### Pattern 1: Ask a Question

```typescript
const response = await client.post('/api/x402/llm/glm', {
  messages: [
    { role: 'user', content: 'What is quantum computing?' }
  ],
  temperature: 0.7,
  max_tokens: 500,
  stream: false
});
```

### Pattern 2: Generate Code

```typescript
const response = await client.post('/api/x402/llm/qwen', {  // Best for code
  messages: [
    { role: 'user', content: 'Write a binary search in Python' }
  ],
  temperature: 0.3,  // Lower for more deterministic code
  max_tokens: 1000,
  stream: false
});
```

### Pattern 3: Multi-Turn Conversation

```typescript
const conversation = [
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'What is TypeScript?' }
];

// First exchange
let response = await client.post('/api/x402/llm/glm', {
  messages: conversation,
  stream: false
});

let data = response.data;
conversation.push({
  role: 'assistant',
  content: data.choices[0].message.content
});

// Continue conversation
conversation.push({
  role: 'user',
  content: 'How is it different from JavaScript?'
});

response = await client.post('/api/x402/llm/glm', {
  messages: conversation,
  stream: false
});
```

### Pattern 4: Compare Multiple Models

```typescript
const response = await client.post('/api/x402/multi', {
  messages: [{ role: 'user', content: 'Explain blockchain' }],
  stream: false
});

const data = response.data;
data.models.forEach((model: any) => {
  console.log(`${model.name}: ${model.content}`);
});
```

## Choosing the Right Model

Quick reference:

- **Coding?** Use `/api/x402/llm/qwen`
- **Long documents?** Use `/api/x402/llm/kimi` (200K context)
- **Math/reasoning?** Use `/api/x402/llm/deepseek-r1-0528`
- **Multilingual?** Use `/api/x402/llm/glm`
- **Production/general?** Use `/api/x402/llm/deepseek-v3.1`
- **Fast/simple?** Use `/api/x402/llm/gpt-oss`
- **Compare all?** Use `/api/x402/multi`

See [MODELS.md](./MODELS.md) for detailed comparison.

## Monitoring Costs

Each request costs $0.01 USDC (multi-model costs $0.06).

Track your spending:

```typescript
let requestCount = 0;

async function makeRequest(messages: any[]) {
  const response = await fetch(API_URL, { ... });
  requestCount++;
  console.log(`Requests: ${requestCount}, Cost: $${requestCount * 0.01}`);
  return response;
}
```

## Troubleshooting

### Error: "Insufficient funds"

- Add more USDC to your wallet on Base network
- Ensure you have ETH for gas fees

### Error: "Invalid private key"

- Check your `.env` file
- Ensure private key starts with `0x`
- Use a fresh private key (not your main wallet for security)

### Error: "Network error"

- Check your internet connection
- Verify the API URL is correct
- Try again (transient network issues)

### Slow responses

- Normal latency: 1-3 seconds
- If consistently slow, try a different model
- GPT-OSS and Kimi are fastest

## Next Steps

1. **Explore Examples**: Check the [examples](../examples) folder
2. **Read API Docs**: See [API_REFERENCE.md](./API_REFERENCE.md)
3. **Compare Models**: Review [MODELS.md](./MODELS.md)
4. **Build Something**: Start integrating into your app!

## Getting Help

- **Support**: [x.ai/jatevoid](https://x.ai/jatevoid)
- **Docs**: [Full documentation](../README.md)

## Security Best Practices

1. ✅ Use a dedicated wallet for API payments (not your main wallet)
2. ✅ Keep minimal funds in the wallet (just what you need)
3. ✅ Never commit `.env` files to version control
4. ✅ Rotate private keys periodically
5. ✅ Monitor wallet activity on BaseScan

Happy building! 🚀
