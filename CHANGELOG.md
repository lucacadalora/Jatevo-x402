# Changelog

All notable changes to the JATEVO x402 API SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-11-11

### Added
- 🤖 **GLM 4.6 Support**: Added support for GLM 4.6, the latest generation Chinese-English bilingual model with enhanced reasoning capabilities
- 📋 **Explicit Model Versioning**: Added `glm-4.5` and `glm-4.6` as separate model types for explicit version selection
- 🔄 **Backward Compatibility**: Maintained `glm` alias for existing integrations (points to GLM 4.5)

### Changed
- Updated `ModelType` to include `glm-4.5` and `glm-4.6` as separate options
- Modified `MODELS` object to expose all three GLM variants (glm, glm-4.5, glm-4.6)
- Enhanced model descriptions to reflect accurate capabilities and versioning

### Deprecated
- ⚠️ **'glm' alias**: The generic 'glm' model identifier is deprecated in favor of explicit version selection (`glm-4.5` or `glm-4.6`). The alias currently points to `glm-4.5` for backward compatibility but may be removed in future major versions.

### Migration Guide
```javascript
// Old (v1.1.0 and earlier) - Still works but deprecated
const response = await client.chat('glm', { 
  messages: [{ role: 'user', content: 'Hello' }] 
});

// New (v1.3.0) - Recommended approach
const response = await client.chat('glm-4.6', { 
  messages: [{ role: 'user', content: 'Hello' }] 
});
```

### Technical Details
- GLM 4.5 endpoint: `/api/x402/llm/glm-4.5`
- GLM 4.6 endpoint: `/api/x402/llm/glm-4.6`
- Both models maintain $0.01 USDC per request pricing
- Full backward compatibility maintained for existing `glm` usage

## [1.1.0] - 2024-12-27

### Added
- 🌐 **Dual-Network Support**: Full support for both Base (Ethereum L2) and Solana blockchain networks
- 💰 **Solana USDC Payments**: Native SPL token transfer implementation for Solana mainnet and devnet
- 🔌 **Browser Wallet Integration**: Connect Phantom and Solflare wallets directly in browser environments
- 🔄 **Dynamic Network Selection**: Automatically detect and switch between payment networks based on API requirements
- 📱 **Wallet Connection Persistence**: Maintain wallet connections across multiple API calls
- ⚡ **Improved Payment Flow**: Real transaction signing and submission for both networks
- 🎯 **Network-Specific Handlers**: Dedicated `SolanaPaymentHandler` class for Solana transactions
- 💳 **Multi-Wallet Support**: Support for both keypair files (server) and browser wallets (client)
- 📊 **Balance Checking**: New methods to check USDC balance on both networks
- 🔍 **Enhanced Debugging**: Detailed debug logs for payment flows and network interactions

### Changed
- Updated `X402Client` constructor to accept network configuration
- Modified payment interceptor to handle dual-network 402 responses
- Enhanced type definitions to support Solana-specific configurations
- Improved error messages for network-specific issues

### Technical Details
- Added dependencies: `@solana/web3.js` (^1.95.8) and `@solana/spl-token` (^0.4.9)
- Implemented SPL token transfer logic with proper Associated Token Account handling
- Added support for Solana RPC endpoints configuration
- Created comprehensive browser example with Phantom wallet integration

### Migration Guide
```javascript
// Old (v1.0.0 - Base only)
const client = new X402Client({
  privateKey: '0x...'
});

// New (v1.1.0 - Choose network)
const client = new X402Client({
  network: 'solana', // or 'base'
  privateKey: '0x...', // for Base
  solanaWallet: keypair // for Solana
});
```

### Examples
- Added `solana-basic.ts` - Server-side Solana integration example
- Added `solana-browser.html` - Browser-based Phantom wallet example
- Added `multi-network.ts` - Dynamic network selection example

## [1.0.0] - 2024-12-20

### Initial Release
- 🚀 **Base Network Support**: Initial implementation for Base (Ethereum L2) payments
- 📦 **x402 Protocol**: Implementation of x402 payment standard for API access
- 🤖 **6 AI Models**: Support for Qwen, GLM, Kimi, DeepSeek R1/V3.1, and GPT-OSS
- 🔄 **OpenAI Compatibility**: Drop-in replacement for OpenAI client libraries
- 💸 **USDC Payments**: Pay-per-use model with 0.01 USDC per request
- 🛠️ **TypeScript Support**: Full TypeScript definitions and type safety
- 📚 **Documentation**: Comprehensive API documentation and examples

### Features
- Automatic payment handling via x402 interceptor
- Multi-model query endpoint for parallel model comparison
- Session-based request handling
- Cost estimation utilities

### Supported Models
- Qwen 3 Coder 480B (128K context)
- GLM 4.5 (128K context)
- Kimi K2 Instruct (200K context)
- DeepSeek R1 0528 (64K context)
- DeepSeek V3.1 (128K context)
- GPT-OSS 120B (32K context)

---

## Future Roadmap

### Planned Features
- [ ] Python SDK support
- [ ] Streaming response support
- [ ] WebSocket connections for real-time updates
- [ ] Additional blockchain network support (Polygon, Arbitrum)
- [ ] Batch request processing
- [ ] Usage analytics dashboard
- [ ] Model fine-tuning capabilities

### Under Consideration
- Multi-currency support beyond USDC
- Subscription plans for high-volume users
- Custom model hosting
- Edge deployment options

---

For more information, visit [x.ai/jatevoid](https://x.ai/jatevoid)