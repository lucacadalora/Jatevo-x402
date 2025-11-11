interface X402Config {
    baseUrl?: string;
    privateKey?: string;
    walletAddress?: string;
    network?: 'base' | 'base-testnet' | 'solana' | 'solana-devnet';
    debug?: boolean;
    solanaRpcUrl?: string;
    solanaWallet?: any;
}
interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
interface LLMRequest {
    messages: LLMMessage[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}
interface LLMResponse {
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
interface PaymentRequirements {
    network: string;
    maxAmountRequired: string;
    asset: string;
    payTo: string;
    from?: string;
    validDuration?: number;
    nonce?: string;
    deadline?: number;
}
interface EVMPaymentData {
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
interface SolanaPaymentData {
    from: string;
    to: string;
    amount: string;
    value?: string;
    signature: string;
    network: 'solana' | 'solana-devnet';
    timestamp?: number;
    confirmed?: boolean;
}
type PaymentData = EVMPaymentData | SolanaPaymentData;
type ModelType = 'qwen' | 'glm' | 'glm-4.5' | 'glm-4.6' | 'kimi' | 'deepseek-r1-0528' | 'deepseek-v3.1' | 'gpt-oss';
interface ModelInfo {
    id: ModelType;
    name: string;
    description: string;
    endpoint: string;
    price: string;
    priceInMicroUSDC: number;
}

declare class X402Client {
    private client;
    private paymentHandler;
    private solanaHandler?;
    private config;
    private connectedWallet?;
    constructor(config?: X402Config);
    private setupInterceptors;
    /**
     * Query an LLM model
     */
    query(model: ModelType, request: LLMRequest): Promise<LLMResponse>;
    /**
     * Convenience method for single message queries
     */
    chat(model: ModelType, message: string, options?: {
        temperature?: number;
        max_tokens?: number;
    }): Promise<string>;
    /**
     * List all available models
     */
    getModels(): ModelInfo[];
    /**
     * Get information about a specific model
     */
    getModel(modelId: ModelType): ModelInfo;
    /**
     * Get the configured wallet address
     */
    getWalletAddress(): string | undefined;
    /**
     * Check USDC balance (requires separate API implementation)
     */
    checkBalance(address?: string): Promise<{
        balance: string;
        formatted: string;
    }>;
    /**
     * Check USDC balance on Solana
     */
    checkSolanaBalance(address?: string): Promise<number>;
    /**
     * Estimate cost for a request
     */
    estimateCost(model: ModelType, estimatedTokens?: number): {
        model: string;
        pricePerRequest: string;
        estimatedCost: string;
    };
    /**
     * Connect to wallet (browser environment)
     * For Solana: connects to Phantom or Solflare wallets
     * For Base: would connect to MetaMask or other EVM wallets
     */
    connectWallet(): Promise<{
        address: string;
        network: string;
    }>;
    /**
     * Disconnect wallet
     */
    disconnectWallet(): void;
    /**
     * Get current network
     */
    getNetwork(): string;
    /**
     * Check if a network is supported
     */
    supportsNetwork(network: string): boolean;
    /**
     * Switch to a different network
     */
    switchNetwork(network: 'base' | 'base-testnet' | 'solana' | 'solana-devnet'): void;
    /**
     * Check if wallet is connected
     */
    isWalletConnected(): boolean;
    /**
     * Get connected wallet info
     */
    getConnectedWallet(): {
        address: string;
        network: string;
    } | null;
}

/**
 * Unified Payment Handler that supports both EVM (Base) and Solana networks
 */
declare class PaymentHandler {
    private evmAccount;
    private solanaHandler;
    private network;
    constructor(config?: {
        privateKey?: string;
        network?: string;
        solanaWallet?: any;
        solanaRpcUrl?: string;
    });
    /**
     * Create payment header based on network type
     */
    createPaymentHeader(requirements: PaymentRequirements): Promise<string>;
    /**
     * Create EVM (Base) payment header
     */
    private createEVMPaymentHeader;
    /**
     * Create Solana payment header
     */
    private createSolanaPaymentHeader;
    /**
     * Get chain ID based on network
     */
    private getChainId;
    /**
     * Generate random nonce
     */
    private generateNonce;
    /**
     * Parse EVM signature
     */
    private parseEVMSignature;
    /**
     * Get wallet address based on network
     */
    getWalletAddress(): string | undefined;
    /**
     * Check if payment handler supports a network
     */
    supportsNetwork(network: string): boolean;
    /**
     * Parse payment requirements from 402 response
     * Automatically detects and returns the appropriate requirements
     */
    parsePaymentRequirements(response: any): PaymentRequirements;
    /**
     * Connect to wallet (browser environment)
     */
    connectWallet(): Promise<void>;
}
declare function createPaymentHandler(privateKeyOrConfig?: string | any): PaymentHandler;

/**
 * Solana payment handler for x402 protocol
 * Handles USDC transfers on Solana blockchain
 */
declare function isSolanaNetwork(network: string): boolean;

declare class SolanaPaymentHandler {
    private connection;
    private network;
    private usdcMint;
    private wallet;
    constructor(config?: {
        network?: 'solana' | 'solana-devnet';
        rpcUrl?: string;
    });
    /**
     * Set the wallet provider (Phantom, Solflare, or Keypair)
     */
    setWallet(wallet: any): void;
    /**
     * Connect to a browser wallet (Phantom or Solflare)
     */
    connectWallet(): Promise<{
        wallet: any;
        publicKey: string;
    }>;
    /**
     * Get USDC balance for a wallet address
     */
    getUSDCBalance(walletAddress: string): Promise<number>;
    /**
     * Create and sign a Solana USDC payment transaction
     */
    createPayment(amount: string, receiverAddress: string, wallet?: any): Promise<SolanaPaymentData>;
    /**
     * Verify a payment transaction on-chain
     */
    verifyPayment(signature: string): Promise<boolean>;
    /**
     * Create payment header for Solana (base64 encoded)
     * This is called after a payment is made to create the header for backend verification
     */
    createPaymentHeader(paymentData: SolanaPaymentData, requirements?: PaymentRequirements): string;
    /**
     * Parse payment requirements for Solana
     */
    static parsePaymentRequirements(requirements: PaymentRequirements): {
        receiverAddress: string;
        amount: string;
        network: 'solana' | 'solana-devnet';
    };
}

declare const MODELS: Record<ModelType, ModelInfo>;
declare function getModel(modelId: ModelType): ModelInfo;
declare function listModels(): ModelInfo[];

export { type EVMPaymentData, type LLMMessage, type LLMRequest, type LLMResponse, MODELS, type ModelInfo, type ModelType, type PaymentData, PaymentHandler, type PaymentRequirements, type SolanaPaymentData, SolanaPaymentHandler, X402Client, type X402Config, createPaymentHandler, X402Client as default, getModel, isSolanaNetwork, listModels };
