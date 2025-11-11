// src/client.ts
import axios from "axios";

// src/payment.ts
import { privateKeyToAccount } from "viem/accounts";
import { toHex } from "viem";
import { randomBytes } from "crypto";

// src/solana-payment.ts
import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Keypair
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  getAccount,
  TokenAccountNotFoundError,
  createAssociatedTokenAccountInstruction
} from "@solana/spl-token";
function isSolanaNetwork(network) {
  return network === "solana" || network === "solana-devnet";
}
var SOLANA_CONFIG = {
  mainnet: {
    network: "solana",
    usdcMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    rpcUrl: "https://api.mainnet-beta.solana.com"
  },
  devnet: {
    network: "solana-devnet",
    usdcMint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    // USDC-Dev on devnet
    rpcUrl: "https://api.devnet.solana.com"
  }
};
var SolanaPaymentHandler = class {
  // Will be Phantom/Solflare provider or Keypair for Node.js
  constructor(config) {
    this.network = config?.network || "solana";
    const configData = this.network === "solana" ? SOLANA_CONFIG.mainnet : SOLANA_CONFIG.devnet;
    this.connection = new Connection(config?.rpcUrl || configData.rpcUrl, "confirmed");
    this.usdcMint = new PublicKey(configData.usdcMint);
  }
  /**
   * Set the wallet provider (Phantom, Solflare, or Keypair)
   */
  setWallet(wallet) {
    this.wallet = wallet;
  }
  /**
   * Connect to a browser wallet (Phantom or Solflare)
   */
  async connectWallet() {
    if (typeof globalThis !== "undefined" && typeof globalThis.window !== "undefined") {
      const window = globalThis.window;
      if (window.phantom?.solana?.isPhantom) {
        try {
          const response = await window.phantom.solana.connect();
          this.wallet = window.phantom.solana;
          return {
            wallet: this.wallet,
            publicKey: response.publicKey.toString()
          };
        } catch (err) {
          console.error("Phantom connection failed:", err);
        }
      }
      if (window.solflare?.isSolflare) {
        try {
          await window.solflare.connect();
          this.wallet = window.solflare;
          return {
            wallet: this.wallet,
            publicKey: window.solflare.publicKey.toString()
          };
        } catch (err) {
          console.error("Solflare connection failed:", err);
        }
      }
      throw new Error("No Solana wallet found. Please install Phantom or Solflare.");
    }
    throw new Error("Wallet connection is only available in browser environment");
  }
  /**
   * Get USDC balance for a wallet address
   */
  async getUSDCBalance(walletAddress) {
    try {
      const walletPubkey = new PublicKey(walletAddress);
      const tokenAccount = await getAssociatedTokenAddress(
        this.usdcMint,
        walletPubkey
      );
      const balance = await this.connection.getTokenAccountBalance(tokenAccount);
      return parseFloat(balance.value.uiAmountString || "0");
    } catch (error) {
      if (error.message?.includes("could not find account")) {
        return 0;
      }
      throw error;
    }
  }
  /**
   * Create and sign a Solana USDC payment transaction
   */
  async createPayment(amount, receiverAddress, wallet) {
    if (!wallet && !this.wallet) {
      throw new Error("Wallet is required for Solana payments");
    }
    const activeWallet = wallet || this.wallet;
    const senderPublicKey = activeWallet.publicKey || (activeWallet instanceof Keypair ? activeWallet.publicKey : new PublicKey(activeWallet));
    const amountMicroUsdc = parseInt(amount);
    const receiverPubkey = new PublicKey(receiverAddress);
    const senderTokenAccount = await getAssociatedTokenAddress(
      this.usdcMint,
      senderPublicKey
    );
    const receiverTokenAccount = await getAssociatedTokenAddress(
      this.usdcMint,
      receiverPubkey
    );
    try {
      const senderAccount = await getAccount(this.connection, senderTokenAccount);
      const balance = Number(senderAccount.amount);
      if (balance < amountMicroUsdc) {
        throw new Error(`Insufficient USDC balance. Have: ${balance / 1e6} USDC, Need: ${amountMicroUsdc / 1e6} USDC`);
      }
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        throw new Error("No USDC token account found. Please ensure you have USDC in your wallet.");
      }
      throw error;
    }
    const transaction = new Transaction();
    try {
      await getAccount(this.connection, receiverTokenAccount);
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        const createATAInstruction = createAssociatedTokenAccountInstruction(
          senderPublicKey,
          receiverTokenAccount,
          receiverPubkey,
          this.usdcMint
        );
        transaction.add(createATAInstruction);
      }
    }
    const transferInstruction = createTransferInstruction(
      senderTokenAccount,
      receiverTokenAccount,
      senderPublicKey,
      amountMicroUsdc
    );
    transaction.add(transferInstruction);
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;
    let signature;
    if (typeof activeWallet.signAndSendTransaction === "function") {
      const signedTx = await activeWallet.signAndSendTransaction(transaction);
      signature = signedTx.signature || signedTx;
      await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, "confirmed");
    } else if (activeWallet instanceof Keypair) {
      signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [activeWallet],
        { commitment: "confirmed" }
      );
    } else {
      throw new Error("Unsupported wallet type");
    }
    return {
      network: this.network,
      signature,
      from: senderPublicKey.toString(),
      to: receiverAddress,
      amount,
      timestamp: Date.now(),
      confirmed: true
    };
  }
  /**
   * Verify a payment transaction on-chain
   */
  async verifyPayment(signature) {
    try {
      const tx = await this.connection.getTransaction(signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0
      });
      return tx !== null && tx.meta?.err === null;
    } catch (error) {
      console.error("Error verifying Solana payment:", error);
      return false;
    }
  }
  /**
   * Create payment header for Solana (base64 encoded)
   * This is called after a payment is made to create the header for backend verification
   */
  createPaymentHeader(paymentData, requirements) {
    const header = {
      network: paymentData.network,
      signature: paymentData.signature,
      from: paymentData.from,
      to: paymentData.to,
      amount: paymentData.amount || paymentData.value,
      timestamp: paymentData.timestamp || Date.now()
    };
    return Buffer.from(JSON.stringify(header)).toString("base64");
  }
  /**
   * Parse payment requirements for Solana
   */
  static parsePaymentRequirements(requirements) {
    if (requirements.network !== "solana" && requirements.network !== "solana-devnet") {
      throw new Error("Invalid network for Solana payment handler");
    }
    return {
      receiverAddress: requirements.payTo,
      amount: requirements.maxAmountRequired,
      network: requirements.network
    };
  }
};

// src/payment.ts
var PaymentHandler = class {
  constructor(config) {
    this.solanaHandler = null;
    this.network = config?.network || "base";
    if (config?.privateKey && !isSolanaNetwork(this.network)) {
      this.evmAccount = privateKeyToAccount(config.privateKey);
    }
    if (isSolanaNetwork(this.network)) {
      this.solanaHandler = new SolanaPaymentHandler({
        rpcUrl: config?.solanaRpcUrl,
        network: this.network
      });
    }
  }
  /**
   * Create payment header based on network type
   */
  async createPaymentHeader(requirements) {
    const reqNetwork = requirements.network || this.network;
    if (isSolanaNetwork(reqNetwork)) {
      return this.createSolanaPaymentHeader(requirements);
    } else {
      return this.createEVMPaymentHeader(requirements);
    }
  }
  /**
   * Create EVM (Base) payment header
   */
  async createEVMPaymentHeader(requirements) {
    if (!this.evmAccount) {
      throw new Error("No private key configured for EVM payments. Cannot create payment.");
    }
    const deadline = Math.floor(Date.now() / 1e3) + 3600;
    const nonce = requirements.nonce || this.generateNonce();
    const domain = {
      name: "USD Coin",
      version: "2",
      chainId: this.getChainId(),
      verifyingContract: requirements.asset
    };
    const types = {
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" }
      ]
    };
    const payTo = requirements.from || "0xB389c8b863193B2A1e48deFD007413702196723B";
    const message = {
      from: this.evmAccount.address,
      to: payTo,
      value: BigInt(requirements.maxAmountRequired),
      validAfter: 0n,
      validBefore: BigInt(deadline),
      nonce
    };
    const signature = await this.evmAccount.signTypedData({
      domain,
      types,
      primaryType: "TransferWithAuthorization",
      message
    });
    const { v, r, s } = this.parseEVMSignature(signature);
    const paymentData = {
      from: this.evmAccount.address,
      to: message.to,
      value: requirements.maxAmountRequired,
      nonce,
      deadline,
      signature: { v, r, s }
    };
    return Buffer.from(JSON.stringify(paymentData)).toString("base64");
  }
  /**
   * Create Solana payment header
   */
  async createSolanaPaymentHeader(requirements) {
    if (!this.solanaHandler) {
      throw new Error("Solana handler not initialized. Cannot create Solana payment.");
    }
    const paymentData = {
      from: "",
      // Will be filled by wallet
      to: requirements.payTo || "",
      // Receiver address from requirements
      amount: requirements.maxAmountRequired,
      value: requirements.maxAmountRequired,
      // Legacy compatibility
      signature: "",
      // Will be filled after transaction
      network: this.network
    };
    return this.solanaHandler.createPaymentHeader(paymentData, requirements);
  }
  /**
   * Get chain ID based on network
   */
  getChainId() {
    switch (this.network) {
      case "base":
        return 8453;
      // Base mainnet
      case "base-testnet":
      case "base-sepolia":
        return 84532;
      // Base Sepolia
      default:
        return 8453;
    }
  }
  /**
   * Generate random nonce
   */
  generateNonce() {
    const bytes = randomBytes(32);
    return toHex(bytes);
  }
  /**
   * Parse EVM signature
   */
  parseEVMSignature(signature) {
    const sig = signature.slice(2);
    const r = `0x${sig.slice(0, 64)}`;
    const s = `0x${sig.slice(64, 128)}`;
    const v = parseInt(sig.slice(128, 130), 16);
    return { v, r, s };
  }
  /**
   * Get wallet address based on network
   */
  getWalletAddress() {
    if (isSolanaNetwork(this.network)) {
      return void 0;
    }
    return this.evmAccount?.address;
  }
  /**
   * Check if payment handler supports a network
   */
  supportsNetwork(network) {
    return ["base", "base-testnet", "base-sepolia", "solana", "solana-devnet"].includes(network);
  }
  /**
   * Parse payment requirements from 402 response
   * Automatically detects and returns the appropriate requirements
   */
  parsePaymentRequirements(response) {
    const accepts = response.accepts || [];
    let requirements = accepts.find((req) => req.network === this.network);
    if (!requirements && accepts.length > 0) {
      requirements = accepts[0];
      console.warn(`No requirements found for network ${this.network}, using ${requirements.network}`);
    }
    if (!requirements) {
      throw new Error("No payment requirements found in 402 response");
    }
    return requirements;
  }
  /**
   * Connect to wallet (browser environment)
   */
  async connectWallet() {
    if (isSolanaNetwork(this.network) && this.solanaHandler) {
      await this.solanaHandler.connectWallet();
    }
  }
};
function createPaymentHandler(privateKeyOrConfig) {
  if (typeof privateKeyOrConfig === "string") {
    return new PaymentHandler({ privateKey: privateKeyOrConfig });
  }
  return new PaymentHandler(privateKeyOrConfig);
}

// src/models.ts
var MODELS = {
  "qwen": {
    id: "qwen",
    name: "Qwen 3 Coder 480B",
    description: "Advanced code generation and analysis model",
    endpoint: "/api/x402/llm/qwen",
    price: "$0.01",
    priceInMicroUSDC: 1e4
  },
  "glm": {
    id: "glm",
    name: "GLM 4.5 (deprecated alias)",
    description: 'Advanced reasoning and problem-solving model. Use "glm-4.5" or "glm-4.6" instead.',
    endpoint: "/api/x402/llm/glm-4.5",
    price: "$0.01",
    priceInMicroUSDC: 1e4
  },
  "glm-4.5": {
    id: "glm-4.5",
    name: "GLM 4.5",
    description: "Advanced Chinese-English bilingual model for high-quality text generation",
    endpoint: "/api/x402/llm/glm-4.5",
    price: "$0.01",
    priceInMicroUSDC: 1e4
  },
  "glm-4.6": {
    id: "glm-4.6",
    name: "GLM 4.6",
    description: "Latest generation Chinese-English bilingual model with enhanced reasoning capabilities",
    endpoint: "/api/x402/llm/glm-4.6",
    price: "$0.01",
    priceInMicroUSDC: 1e4
  },
  "kimi": {
    id: "kimi",
    name: "Kimi K2",
    description: "Long context understanding and analysis",
    endpoint: "/api/x402/llm/kimi",
    price: "$0.01",
    priceInMicroUSDC: 1e4
  },
  "deepseek-r1-0528": {
    id: "deepseek-r1-0528",
    name: "DeepSeek R1 0528",
    description: "Latest reasoning model with online capabilities",
    endpoint: "/api/x402/llm/deepseek-r1-0528",
    price: "$0.01",
    priceInMicroUSDC: 1e4
  },
  "deepseek-v3.1": {
    id: "deepseek-v3.1",
    name: "DeepSeek V3.1",
    description: "Efficient chat model with competitive performance",
    endpoint: "/api/x402/llm/deepseek-v3.1",
    price: "$0.01",
    priceInMicroUSDC: 1e4
  },
  "gpt-oss": {
    id: "gpt-oss",
    name: "GPT-OSS",
    description: "OpenAI's efficient model for general tasks",
    endpoint: "/api/x402/llm/gpt-oss",
    price: "$0.01",
    priceInMicroUSDC: 1e4
  }
};
function getModel(modelId) {
  const model = MODELS[modelId];
  if (!model) {
    throw new Error(`Unknown model: ${modelId}`);
  }
  return model;
}
function listModels() {
  return Object.values(MODELS);
}

// src/client.ts
var X402Client = class {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || "https://jatevo.ai",
      network: config.network || "base",
      debug: config.debug || false,
      ...config
    };
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.paymentHandler = new PaymentHandler({
      privateKey: config.privateKey,
      network: this.config.network,
      solanaWallet: config.solanaWallet,
      solanaRpcUrl: config.solanaRpcUrl
    });
    if (isSolanaNetwork(this.config.network || "")) {
      this.solanaHandler = new SolanaPaymentHandler({
        network: this.config.network,
        rpcUrl: config.solanaRpcUrl
      });
      if (config.solanaWallet) {
        this.solanaHandler.setWallet(config.solanaWallet);
      }
    }
    this.setupInterceptors();
  }
  setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 402 && !originalRequest._retry) {
          originalRequest._retry = true;
          if (this.config.debug) {
            console.log("[X402 SDK] Received 402 Payment Required");
          }
          try {
            const paymentResponse = error.response.data;
            const paymentRequirements = this.paymentHandler.parsePaymentRequirements(paymentResponse);
            if (this.config.debug) {
              console.log(`[X402 SDK] Using ${paymentRequirements.network} network for payment`);
            }
            if (isSolanaNetwork(paymentRequirements.network)) {
              if (!this.connectedWallet || !this.solanaHandler) {
                throw new Error("Solana wallet not connected. Call connectWallet() first.");
              }
              const paymentData = await this.solanaHandler.createPayment(
                paymentRequirements.maxAmountRequired,
                paymentRequirements.payTo,
                this.connectedWallet.wallet
              );
              const paymentHeader = this.solanaHandler.createPaymentHeader(paymentData, paymentRequirements);
              if (this.config.debug) {
                console.log("[X402 SDK] Created Solana payment header with signature:", paymentData.signature);
              }
              originalRequest.headers["X-PAYMENT"] = paymentHeader;
            } else {
              const paymentHeader = await this.paymentHandler.createPaymentHeader(paymentRequirements);
              if (this.config.debug) {
                console.log("[X402 SDK] Created EVM payment header");
              }
              originalRequest.headers["X-PAYMENT"] = paymentHeader;
            }
            return this.client(originalRequest);
          } catch (paymentError) {
            if (this.config.debug) {
              console.error("[X402 SDK] Payment failed:", paymentError);
            }
            throw paymentError;
          }
        }
        return Promise.reject(error);
      }
    );
  }
  /**
   * Query an LLM model
   */
  async query(model, request) {
    const modelInfo = getModel(model);
    if (this.config.debug) {
      console.log(`[X402 SDK] Querying ${modelInfo.name} at ${modelInfo.endpoint}`);
    }
    const response = await this.client.post(
      modelInfo.endpoint,
      request
    );
    return response.data;
  }
  /**
   * Convenience method for single message queries
   */
  async chat(model, message, options) {
    const response = await this.query(model, {
      messages: [{ role: "user", content: message }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1e3,
      stream: false
    });
    return response.choices[0]?.message?.content || "";
  }
  /**
   * List all available models
   */
  getModels() {
    return listModels();
  }
  /**
   * Get information about a specific model
   */
  getModel(modelId) {
    return getModel(modelId);
  }
  /**
   * Get the configured wallet address
   */
  getWalletAddress() {
    if (this.connectedWallet) {
      return this.connectedWallet.address;
    }
    return this.paymentHandler.getWalletAddress();
  }
  /**
   * Check USDC balance (requires separate API implementation)
   */
  async checkBalance(address) {
    const walletAddress = address || this.getWalletAddress();
    if (!walletAddress) {
      throw new Error("No wallet address provided or configured");
    }
    try {
      const response = await this.client.get(`/api/x402/balance/${walletAddress}`);
      return response.data;
    } catch (error) {
      if (this.config.debug) {
        console.error("[X402 SDK] Balance check failed:", error);
      }
      throw error;
    }
  }
  /**
   * Check USDC balance on Solana
   */
  async checkSolanaBalance(address) {
    if (!this.solanaHandler) {
      throw new Error("Solana handler not initialized");
    }
    const walletAddress = address || this.getWalletAddress();
    if (!walletAddress) {
      throw new Error("No wallet address provided or configured");
    }
    return await this.solanaHandler.getUSDCBalance(walletAddress);
  }
  /**
   * Estimate cost for a request
   */
  estimateCost(model, estimatedTokens = 1e3) {
    const modelInfo = getModel(model);
    return {
      model: modelInfo.name,
      pricePerRequest: modelInfo.price,
      estimatedCost: modelInfo.price
      // Fixed price per request
    };
  }
  /**
   * Connect to wallet (browser environment)
   * For Solana: connects to Phantom or Solflare wallets
   * For Base: would connect to MetaMask or other EVM wallets
   */
  async connectWallet() {
    const network = this.config.network || "base";
    if (isSolanaNetwork(network)) {
      if (!this.solanaHandler) {
        this.solanaHandler = new SolanaPaymentHandler({
          network,
          rpcUrl: this.config.solanaRpcUrl
        });
      }
      const { wallet, publicKey } = await this.solanaHandler.connectWallet();
      this.connectedWallet = {
        address: publicKey,
        wallet,
        network
      };
      this.solanaHandler.setWallet(wallet);
      if (this.config.debug) {
        console.log("[X402 SDK] Connected Solana wallet:", publicKey);
      }
      return {
        address: publicKey,
        network
      };
    } else {
      await this.paymentHandler.connectWallet();
      const address = this.getWalletAddress();
      if (!address) {
        throw new Error("Failed to get wallet address after connection");
      }
      this.connectedWallet = {
        address,
        wallet: null,
        // EVM wallet object would go here
        network
      };
      return {
        address,
        network
      };
    }
  }
  /**
   * Disconnect wallet
   */
  disconnectWallet() {
    this.connectedWallet = void 0;
    if (this.solanaHandler) {
      this.solanaHandler.setWallet(null);
    }
  }
  /**
   * Get current network
   */
  getNetwork() {
    return this.config.network || "base";
  }
  /**
   * Check if a network is supported
   */
  supportsNetwork(network) {
    return this.paymentHandler.supportsNetwork(network);
  }
  /**
   * Switch to a different network
   */
  switchNetwork(network) {
    this.config.network = network;
    this.disconnectWallet();
    this.paymentHandler = new PaymentHandler({
      privateKey: this.config.privateKey,
      network,
      solanaWallet: this.config.solanaWallet,
      solanaRpcUrl: this.config.solanaRpcUrl
    });
    if (isSolanaNetwork(network)) {
      this.solanaHandler = new SolanaPaymentHandler({
        network,
        rpcUrl: this.config.solanaRpcUrl
      });
    } else {
      this.solanaHandler = void 0;
    }
  }
  /**
   * Check if wallet is connected
   */
  isWalletConnected() {
    return !!this.connectedWallet;
  }
  /**
   * Get connected wallet info
   */
  getConnectedWallet() {
    if (!this.connectedWallet) {
      return null;
    }
    return {
      address: this.connectedWallet.address,
      network: this.connectedWallet.network
    };
  }
};

// src/index.ts
var index_default = X402Client;
export {
  MODELS,
  PaymentHandler,
  SolanaPaymentHandler,
  X402Client,
  createPaymentHandler,
  index_default as default,
  getModel,
  isSolanaNetwork,
  listModels
};
