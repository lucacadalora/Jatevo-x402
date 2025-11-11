# Integration Guide for VSCode/Terminal

## Quick Setup

### 1. Install SDK
```bash
npm install jatevo-x402-sdk axios
```

### 2. Set Private Key
```bash
# For Base (Ethereum)
export PRIVATE_KEY="0x..."

# For Solana
export PRIVATE_KEY="[1,2,3,...]"
```

### 3. Create Script
```javascript
const { withPaymentInterceptor } = require('jatevo-x402-sdk');
const axios = require('axios');

const client = withPaymentInterceptor(axios.create(), process.env.PRIVATE_KEY);
```

## Common VSCode/Terminal Issues

### Issue: "Cannot find module 'jatevo-x402-sdk'"
**Solution**: Make sure you're in the right directory and have run `npm install`
```bash
ls node_modules/jatevo-x402-sdk  # Check if installed
npm list jatevo-x402-sdk          # Check version
```

### Issue: "PRIVATE_KEY environment variable not set"
**Solution**: Set it in your terminal or `.env` file

**Terminal (temporary)**:
```bash
export PRIVATE_KEY="0x..."
node your-script.js
```

**VSCode Terminal (persistent for session)**:
```bash
# Add to ~/.bashrc or ~/.zshrc
echo 'export PRIVATE_KEY="0x..."' >> ~/.bashrc
source ~/.bashrc
```

**.env file (recommended)**:
```bash
# Create .env file
echo 'PRIVATE_KEY=0x...' > .env

# Load in your script
require('dotenv').config();
```

### Issue: "Payment Required (402)" but you have USDC
**Possible Causes**:
1. Wrong network (Base vs Solana)
2. USDC on wrong network
3. Insufficient balance (need $0.01 + gas)

**Debug Steps**:
```javascript
// Check which network is being used
console.log('Private key format:', process.env.PRIVATE_KEY.substring(0, 2));
// "0x" = Base, "[" = Solana

// Check balance (use wallet app or explorer)
// Base: https://basescan.org/address/YOUR_ADDRESS
// Solana: https://solscan.io/account/YOUR_ADDRESS
```

### Issue: "Invalid Private Key"
**For Base/Ethereum**:
- Must be 64 hex characters after '0x'
- Example: `0x1234...abcd` (66 chars total)

**For Solana**:
- Must be JSON array format
- Example: `[1,2,3,...]` (64 numbers)

**Export from Wallets**:
- MetaMask: Settings → Security & Privacy → Show Private Keys
- Phantom: Settings → Security → Export Private Key


### Issue: Running in CI/CD Pipeline
**GitHub Actions Example**:
```yaml
- name: Run AI Script
  env:
    PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
  run: |
    npm install
    node script.js
```

**Security Note**: Never commit private keys. Use secrets management.

## VSCode Configuration

### Launch Configuration (.vscode/launch.json)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run AI Script",
      "program": "${workspaceFolder}/script.js",
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

### Tasks Configuration (.vscode/tasks.json)
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Test AI Connection",
      "type": "shell",
      "command": "node",
      "args": ["examples/basic.js"],
      "group": "test"
    }
  ]
}
```

## Best Practices

### 1. Environment Management
```javascript
// Use dotenv for local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Validate environment
if (!process.env.PRIVATE_KEY) {
  console.error('❌ PRIVATE_KEY not set');
  console.log('Set it with: export PRIVATE_KEY="0x..."');
  process.exit(1);
}
```

### 2. Error Handling
```javascript
try {
  const response = await client.post(url, data);
  // Handle success
} catch (error) {
  if (error.response?.status === 402) {
    console.error('Payment issue - check balance');
  } else if (error.response?.status === 429) {
    console.error('Rate limited - wait and retry');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

### 3. Logging
```javascript
// Add debug logging
if (process.env.DEBUG) {
  client.interceptors.request.use(request => {
    console.log('Request:', request.url);
    return request;
  });
}
```

## Testing Your Setup

### Quick Test Script
```javascript
// test-connection.js
const { withPaymentInterceptor } = require('jatevo-x402-sdk');
const axios = require('axios');

async function test() {
  console.log('🔍 Testing Jatevo API connection...\n');
  
  // Check environment
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY not set');
    return;
  }
  
  console.log('✅ Private key found');
  console.log('📍 Network:', process.env.PRIVATE_KEY.startsWith('0x') ? 'Base' : 'Solana');
  
  // Test API call
  try {
    const client = withPaymentInterceptor(axios.create(), process.env.PRIVATE_KEY);
    
    console.log('📡 Calling API...');
    const response = await client.post(
      'https://api.jatevo.ai/chat/completions/qwen',
      {
        messages: [{ role: 'user', content: 'Say "test successful"' }],
        max_tokens: 10
      }
    );
    
    console.log('✅ Response:', response.data.choices[0].message.content);
    console.log('💰 Cost: $0.01 USDC');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

test();
```

Run with:
```bash
export PRIVATE_KEY="0x..."
node test-connection.js
```

## Getting Help

1. Check error message carefully
2. Verify USDC balance on correct network
3. Try the test script above
4. Contact support: [x.ai/jatevoid](https://x.ai/jatevoid)

## Common Commands

```bash
# Check SDK version
npm list jatevo-x402-sdk

# Update SDK
npm update jatevo-x402-sdk

# View private key (be careful!)
echo $PRIVATE_KEY | head -c 10

# Test with debug mode
DEBUG=1 node script.js

# Run with specific Node version
nvm use 18 && node script.js
```