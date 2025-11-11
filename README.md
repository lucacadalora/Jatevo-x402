# Jatevo x402 LLM API

Pay-per-use AI models via micropayments. No API keys, no subscriptions. Just $0.01 per request.

## What is x402?

x402 is an open payment standard that enables services to charge for API access using the HTTP `402 Payment Required` status code. Instead of managing API keys, subscriptions, or accounts, clients pay for exactly what they use through cryptocurrency micropayments.

**How x402 Works:**
1. **Make Request** → Your client calls the API normally
2. **Payment Processed** → SDK handles payment automatically in the background
3. **Get Response** → You receive the AI response

It's that simple - the SDK handles all payment details transparently!

**Benefits:**
- ✅ **No API Keys** - Your wallet address is your identity
- ✅ **No Subscriptions** - Pay only for what you use
- ✅ **Privacy** - No personal information required
- ✅ **Instant Access** - Start using immediately with USDC
- ✅ **Fair Pricing** - Same price for everyone: $0.01 per request

The x402 protocol uses USDC (a USD stablecoin) for payments, ensuring predictable costs. Base network is generally faster than Solana for payment settlement.

Learn more about the x402 standard at [x402.gitbook.io](https://x402.gitbook.io/x402)

## Quick Start (Terminal/VSCode)

```bash
npm install x402-axios axios viem
```

```javascript
import { withPaymentInterceptor } from 'x402-axios';
import axios from 'axios';
import { privateKeyToAccount } from 'viem/accounts';

// Configure your account with private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY || '0xPRIVATE_KEY_HERE');

// Create axios client with x402 payment interceptor
const client = withPaymentInterceptor(
  axios.create({ baseURL: 'https://jatevo.ai' }),
  account
);

// Call any model
const response = await client.post('/api/x402/llm/qwen', {
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
});

console.log(response.data.choices[0].message.content);
```

That's it! The SDK handles payments automatically.

## Available Models

All models cost $0.01 USDC per request:

| Model | Best For | Context |
|-------|----------|---------|
| `qwen` | Code generation | 128K |
| `glm-4.5` | Multilingual content | 128K |
| `glm-4.6` | Enhanced reasoning | 128K |
| `kimi` | Long context tasks | 200K |
| `deepseek-r1-0528` | Complex reasoning | 64K |
| `deepseek-v3.1` | General chat | 128K |
| `gpt-oss` | OpenAI compatibility | 32K |

> ⚠️ **Note**: The `glm` identifier is deprecated. Use `glm-4.5` or `glm-4.6` instead for explicit version control.

## API Endpoints

Replace `{model}` with any model from the table above:

```
POST https://jatevo.ai/api/x402/llm/{model}
```

## Examples

### Basic Chat
```javascript
const response = await client.post('/api/x402/llm/qwen', {
  messages: [
    { role: 'user', content: 'Explain async/await' }
  ],
  temperature: 0.7,
  max_tokens: 200
});
```

### Code Generation
```javascript
const response = await client.post('/api/x402/llm/qwen', {
  messages: [
    { role: 'system', content: 'You are an expert programmer.' },
    { role: 'user', content: 'Write a React component for a todo list' }
  ]
});
```

### Multi-turn Conversation
```javascript
const messages = [
  { role: 'user', content: 'What is React?' },
  { role: 'assistant', content: 'React is a JavaScript library...' },
  { role: 'user', content: 'Show me a simple example' }
];

const response = await client.post('/api/x402/llm/kimi', {
  messages: messages
});
```

## Setup Requirements

1. **USDC Balance**: You need USDC on Base or Solana
   - Base: Bridge USDC to Base network
   - Solana: Get USDC on Solana mainnet

2. **Private Key**: Export from your wallet
   - MetaMask: Settings → Security → Export Private Key
   - Phantom: Settings → Export Private Key

3. **Environment Variable**: Store securely
```bash
export PRIVATE_KEY="0x..."  # Base network (starts with 0x)
```

## How It Works

1. Make an API request
2. SDK handles payment automatically in the background
3. You get the AI response

All handled automatically by the SDK!

## Common Issues

### "Payment Required" Error
- Check USDC balance in your wallet
- Ensure private key is correctly set
- Verify you're on the right network

### "Invalid Private Key"
- Base: Should start with `0x`
- Solana: Should be array format `[1,2,3...]`

### Rate Limiting
- Default: 10 requests per minute
- Need more? Contact support

## More Examples

See the [examples](./examples) folder for:
- `basic.js` - Simple chat completion
- `streaming.js` - Streaming responses
- `compare-models.js` - Compare different models

## Advanced Topics

- [Network Selection Guide](./docs/networks.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Integration Guide](./docs/integration.md)

## Support

- Support: [x.ai/jatevoid](https://x.ai/jatevoid)

## License

MIT - See [LICENSE](./LICENSE) file