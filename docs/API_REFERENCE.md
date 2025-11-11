# API Reference

## Base URL
```
https://jatevo.ai
```

## Chat Completions

### Endpoint
```
POST /api/x402/llm/{model}
```

### Available Models
- `qwen` - Qwen 3 Coder 480B
- `glm-4.5` - GLM 4.5
- `glm-4.6` - GLM 4.6
- `kimi` - Kimi K2
- `deepseek-r1-0528` - DeepSeek R1
- `deepseek-v3.1` - DeepSeek V3.1
- `gpt-oss` - GPT-OSS 120B

> ⚠️ **Note**: The `glm` identifier is deprecated. Use `glm-4.5` or `glm-4.6` instead.

### Request Body
```json
{
  "messages": [
    {
      "role": "system|user|assistant",
      "content": "string"
    }
  ],
  "temperature": 0.7,      // Optional (0.0-2.0, default: 0.7)
  "max_tokens": 2048,      // Optional (default: 2048)
  "stream": false          // Optional (default: false)
}
```

### Response
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "qwen",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

### Streaming Response
When `stream: true`, returns Server-Sent Events:

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"qwen","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"qwen","choices":[{"index":0,"delta":{"content":" there"},"finish_reason":null}]}

data: [DONE]
```

## Request Parameters

### Message Roles
- `system` - Set behavior/personality
- `user` - User's input
- `assistant` - Model's previous responses

### Temperature
Controls randomness:
- `0.0` - Deterministic (same input → same output)
- `0.7` - Balanced (default)
- `1.0` - Creative
- `2.0` - Very random

### Max Tokens
Maximum response length:
- Minimum: 1
- Maximum: Model's context limit
- Default: 2048

## Error Responses

### 402 Payment Required
```json
{
  "error": "Payment required",
  "message": "Please use x402 SDK to handle payment"
}
```

### 429 Rate Limited
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please wait."
}
```

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Missing required field: messages"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error",
  "message": "Model temporarily unavailable"
}
```

## Rate Limits

| Tier | Requests/min | Requests/hour |
|------|-------------|---------------|
| Default | 10 | 100 |
| Premium | 60 | 1000 |

## Code Examples

### JavaScript/Node.js
```javascript
import { withPaymentInterceptor } from 'x402-axios';
import axios from 'axios';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(process.env.PRIVATE_KEY);

const client = withPaymentInterceptor(
  axios.create({ baseURL: 'https://jatevo.ai' }),
  account
);

const response = await client.post('/api/x402/llm/qwen', {
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

### Python
```python
import requests
from x402_sdk import with_payment

client = with_payment(requests.Session(), private_key)

response = client.post('https://jatevo.ai/api/x402/llm/qwen', 
  json={'messages': [{'role': 'user', 'content': 'Hello!'}]})
```

### cURL
```bash
# Note: Requires manual payment header creation
curl -X POST https://jatevo.ai/api/x402/llm/qwen \
  -H "Content-Type: application/json" \
  -H "X-Payment: <payment_proof>" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

## Model Comparison

| Model | Best For | Speed | Context | Cost |
|-------|----------|-------|---------|------|
| qwen | Code generation | Fast | 128K | $0.01 |
| glm-4.5 | Advanced reasoning | Medium | 128K | $0.01 |
| glm-4.6 | Enhanced reasoning | Medium | 128K | $0.01 |
| kimi | Long documents | Medium | 200K | $0.01 |
| deepseek-r1-0528 | Deep analysis | Slow | 64K | $0.01 |
| deepseek-v3.1 | General chat | Fast | 128K | $0.01 |
| gpt-oss | OpenAI compat | Fast | 32K | $0.01 |

## OpenAI Compatibility

Our API is OpenAI-compatible. You can use OpenAI SDKs by:

1. Change base URL to `https://jatevo.ai`
2. Use endpoint path `/api/x402/llm/{model}`
3. Handle 402 responses with x402 SDK

## Support

- Support: [x.ai/jatevoid](https://x.ai/jatevoid)