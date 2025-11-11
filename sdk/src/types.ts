export interface X402Config {
  baseUrl?: string;
  privateKey?: string;
  walletAddress?: string;
  network?: 'base' | 'base-testnet' | 'solana' | 'solana-devnet';
  debug?: boolean;
  // Solana-specific options
  solanaRpcUrl?: string;
  solanaWallet?: any; // Can be Phantom, Solflare, or other Solana wallets
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface PaymentRequirements {
  network: string;
  maxAmountRequired: string;
  asset: string;
  payTo: string; // Receiver address
  from?: string;
  validDuration?: number;
  nonce?: string;
  deadline?: number;
}

// EVM-specific payment data for Base network
export interface EVMPaymentData {
  from: string;
  to: string;
  value: string;
  nonce: string;
  deadline: number;
  signature: {
    v: number;
    r: string;
    s: string;
  };
}

// Solana-specific payment data
export interface SolanaPaymentData {
  from: string; // Solana wallet address
  to: string; // Receiver address
  amount: string; // Amount in USDC (micro units)
  value?: string; // Legacy compatibility
  signature: string; // Solana transaction signature
  network: 'solana' | 'solana-devnet';
  timestamp?: number;
  confirmed?: boolean; // Transaction confirmation status
}

// Unified payment data that supports both networks
export type PaymentData = EVMPaymentData | SolanaPaymentData;

export type ModelType = 
  | 'qwen'
  | 'glm'  // @deprecated Use 'glm-4.5' or 'glm-4.6' instead. This alias points to glm-4.5 for backward compatibility.
  | 'glm-4.5'
  | 'glm-4.6'
  | 'kimi'
  | 'deepseek-r1-0528'
  | 'deepseek-v3.1'
  | 'gpt-oss';

export interface ModelInfo {
  id: ModelType;
  name: string;
  description: string;
  endpoint: string;
  price: string;
  priceInMicroUSDC: number;
}