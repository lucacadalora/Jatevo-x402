# Network Selection Guide

## Overview

Jatevo x402 API supports payments on both Base (Ethereum L2) and Solana networks. This guide covers advanced network configuration.

## Quick Recommendation

**For most users**: Use Base network (default) - it's simpler and has better tooling support.

## Base Network

### Details
- **Chain ID**: 8453 (mainnet)
- **USDC Contract**: `0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`
- **Gas Fees**: ~$0.001 per transaction

### Setup
```javascript
// Base is the default - just use your Ethereum private key
const PRIVATE_KEY = "0x..."; // From MetaMask
```

### Getting USDC on Base
1. Bridge from Ethereum mainnet via [bridge.base.org](https://bridge.base.org)
2. Swap ETH for USDC on Base via Uniswap or similar
3. Buy directly on exchanges that support Base

## Solana Network

### Details
- **Network**: Solana mainnet
- **USDC Mint**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **Gas Fees**: ~$0.00025 per transaction

### Setup
```javascript
// For Solana, use array format private key
const PRIVATE_KEY = "[1,2,3,...]"; // From Phantom wallet export
```

### Getting USDC on Solana
1. Buy USDC directly on exchanges (Coinbase, Binance)
2. Swap SOL for USDC on Jupiter or Raydium
3. Bridge from Ethereum via Wormhole or Portal Bridge

## Network Selection Logic

The API automatically detects your network based on:
1. Your private key format (0x = Base, array = Solana)
2. Your wallet's available balance
3. Fallback to Base if ambiguous

## Advanced Configuration

### Force Specific Network
```javascript
// Force Base network
client.defaults.headers['Accept-Networks'] = 'base';

// Force Solana network
client.defaults.headers['Accept-Networks'] = 'solana';
```

### Multi-Network Support
```javascript
// Accept both networks
client.defaults.headers['Accept-Networks'] = 'base,solana';
```

## Performance Comparison

| Aspect | Base | Solana |
|--------|------|--------|
| Speed | Generally faster | Generally slower |
| Fees | Low ($0.001) | Very Low ($0.00025) |
| Tooling | Better | Good |
| Liquidity | High | Very High |

## Troubleshooting

### Base Issues
- **"Insufficient funds"**: Check USDC balance on Base network specifically
- **"Invalid signature"**: Ensure private key starts with `0x`
- **"Network error"**: Base RPC may be congested, retry

### Solana Issues
- **"Transaction failed"**: Solana network congestion, retry with higher priority fee
- **"Invalid keypair"**: Ensure private key is in array format
- **"RPC error"**: Default RPC may be rate limited, use custom RPC

### Custom RPC Endpoints

For production usage, consider using dedicated RPC providers:

**Base**:
- Alchemy: `https://base-mainnet.g.alchemy.com/v2/YOUR_KEY`
- Infura: `https://base-mainnet.infura.io/v3/YOUR_KEY`

**Solana**:
- Helius: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
- QuickNode: `https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/`