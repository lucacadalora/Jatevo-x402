# Model Comparison

Detailed comparison of all available models on the JATEVO x402 AI Inference API.

## Overview

All models are available at **$0.01 USDC per request** via the x402 payment protocol. No subscriptions, API keys, or rate limits.

## Models

### Qwen 3 Coder 480B

**Endpoint:** `/api/x402/llm/qwen`


**Specifications:**
- Parameters: 480 billion
- Context Window: 128,000 tokens
- Architecture: Mixture of Experts (MoE)
- Training Data: Code-heavy corpus with technical documentation

**Strengths:**
- ✅ Exceptional code generation and debugging
- ✅ Strong reasoning capabilities
- ✅ Technical documentation and API design
- ✅ Multi-language programming support
- ✅ Fast inference on optimized hardware

**Best For:**
- Software development and code review
- Technical writing and documentation
- Algorithm implementation
- Code refactoring and optimization
- API endpoint design

**Example Use Cases:**
```
- "Write a REST API in FastAPI with authentication"
- "Debug this React component and explain the issue"
- "Optimize this SQL query for better performance"
- "Generate unit tests for this Python function"
```

---

### GLM 4.5

**Endpoint:** `/api/x402/llm/glm-4.5`

> ⚠️ **Note**: The generic `/api/x402/llm/glm` endpoint is deprecated. Use `/api/x402/llm/glm-4.5` or `/api/x402/llm/glm-4.6` instead.

**Specifications:**
- Parameters: ~100 billion (estimated)
- Context Window: 128,000 tokens
- Architecture: GLM (General Language Model)
- Training Data: Multilingual with Chinese/English focus

**Strengths:**
- ✅ Excellent multilingual capabilities (especially Chinese)
- ✅ Creative writing and storytelling
- ✅ Cultural context awareness
- ✅ Balanced general-purpose performance
- ✅ Natural conversation flow

**Best For:**
- Multilingual applications
- Creative content generation
- Cross-cultural communication
- General chatbots
- Content localization

**Example Use Cases:**
```
- "Translate this marketing copy to Mandarin Chinese"
- "Write a short story about space exploration"
- "Explain Chinese New Year customs to a Western audience"
- "Generate product descriptions in multiple languages"
```

---

### GLM 4.6

**Endpoint:** `/api/x402/llm/glm-4.6`

**Specifications:**
- Parameters: ~100 billion (estimated)
- Context Window: 128,000 tokens
- Architecture: GLM (General Language Model)
- Training Data: Enhanced multilingual corpus with improved reasoning data

**Strengths:**
- ✅ **Enhanced reasoning capabilities** over GLM 4.5
- ✅ Superior multilingual performance (Chinese/English)
- ✅ Improved creative writing and storytelling
- ✅ Better cultural context understanding
- ✅ Advanced problem-solving abilities
- ✅ More natural conversation flow

**Best For:**
- Complex multilingual applications
- Advanced reasoning tasks
- Creative content requiring nuance
- Cross-cultural business communication
- High-quality content localization
- AI assistants requiring deep context

**Example Use Cases:**
```
- "Analyze this business proposal and translate it to Mandarin with cultural adaptations"
- "Write a compelling narrative that bridges Eastern and Western perspectives"
- "Provide a nuanced explanation of cultural differences in business etiquette"
- "Generate marketing content that resonates across different cultures"
- "Solve this logic puzzle and explain the reasoning in both English and Chinese"
```

**Differences from GLM 4.5:**
- Enhanced reasoning and problem-solving
- Better handling of complex multilingual contexts
- Improved quality in creative writing tasks
- More sophisticated cultural understanding
- Better at maintaining coherence in long conversations

---

### Kimi K2 Instruct

**Endpoint:** `/api/x402/llm/kimi`


**Specifications:**
- Parameters: ~100 billion (estimated)
- Context Window: 200,000 tokens (largest)
- Architecture: Transformer with extended context
- Training Data: Long-form documents and research papers

**Strengths:**
- ✅ **Longest context window** (200K tokens)
- ✅ Document analysis and summarization
- ✅ Research paper comprehension
- ✅ Long-form content generation
- ✅ Lightning-fast inference

**Best For:**
- Long document analysis
- Research and academic writing
- Legal document review
- Technical specification analysis
- Multi-document synthesis

**Example Use Cases:**
```
- "Summarize these 3 research papers on climate change"
- "Analyze this 50-page contract for key terms"
- "Compare these technical specifications and highlight differences"
- "Extract key insights from this quarterly earnings report"
```

---

### DeepSeek R1 0528

**Endpoint:** `/api/x402/llm/deepseek-r1-0528`


**Specifications:**
- Parameters: ~70 billion (R1 series)
- Context Window: 64,000 tokens
- Architecture: Reinforcement Learning optimized
- Training Data: Math, science, reasoning-focused

**Strengths:**
- ✅ **Advanced reasoning and logic**
- ✅ Mathematics and scientific problems
- ✅ Step-by-step problem solving
- ✅ Theorem proving and formal logic
- ✅ Chain-of-thought explanations

**Best For:**
- Mathematical problem solving
- Scientific research assistance
- Logical reasoning tasks
- Educational tutoring
- Complex analysis

**Example Use Cases:**
```
- "Prove the Pythagorean theorem step by step"
- "Solve this differential equation: dy/dx = 2x + 3"
- "Explain the proof of Fermat's Last Theorem"
- "Design an experiment to test this hypothesis"
```

---

### DeepSeek V3.1

**Endpoint:** `/api/x402/llm/deepseek-v3.1`


**Specifications:**
- Parameters: ~671 billion (MoE architecture)
- Context Window: 128,000 tokens
- Architecture: Mixture of Experts
- Training Data: Broad general knowledge with code emphasis

**Strengths:**
- ✅ High-performance general purpose
- ✅ Strong coding abilities
- ✅ Balanced reasoning and creativity
- ✅ Efficient MoE architecture
- ✅ Optimized hardware acceleration

**Best For:**
- General-purpose AI applications
- Production-grade code generation
- Technical analysis and review
- System design and architecture
- Complex problem decomposition

**Example Use Cases:**
```
- "Design a microservices architecture for an e-commerce platform"
- "Write production-ready Kubernetes configs"
- "Analyze this codebase and suggest improvements"
- "Generate a comprehensive test suite"
```

---

### GPT-OSS 120B

**Endpoint:** `/api/x402/llm/gpt-oss`


**Specifications:**
- Parameters: 120 billion
- Context Window: 32,000 tokens
- Architecture: GPT-based transformer
- Training Data: Open-source focused

**Strengths:**
- ✅ **Ultra-fast inference**
- ✅ General conversation and content
- ✅ Open-source knowledge
- ✅ Cost-effective for simple tasks
- ✅ Reliable and consistent

**Best For:**
- Real-time chat applications
- Content generation at scale
- Customer support bots
- Quick queries and summaries
- High-throughput applications

**Example Use Cases:**
```
- "Write a product description for this item"
- "Generate FAQ answers for our service"
- "Create social media posts about our launch"
- "Summarize this article in 3 bullet points"
```

---

## Comparison Matrix

| Model | Parameters | Context | Strengths | Speed | Best For |
|-------|-----------|---------|-----------|-------|----------|
| **Qwen 3 Coder** | 480B | 128K | Code, Technical | Fast | Development |
| **GLM 4.5** | ~100B | 128K | Multilingual, Creative | Medium | Content |
| **GLM 4.6** | ~100B | 128K | Enhanced Reasoning | Medium | Advanced Tasks |
| **Kimi K2** | ~100B | **200K** | Long Context | **Fastest** | Documents |
| **DeepSeek R1** | ~70B | 64K | **Reasoning**, Math | Medium | Analysis |
| **DeepSeek V3.1** | 671B | 128K | General, Code | Fast | Production |
| **GPT-OSS** | 120B | 32K | Fast, Reliable | **Fastest** | Scale |

---

## Performance Benchmarks

Based on internal testing with standard prompts:

### Code Generation (Python function, 50 lines)

| Model | Avg Time | Quality | Comments |
|-------|----------|---------|----------|
| Qwen 3 Coder | 1.2s | ⭐⭐⭐⭐⭐ | Most idiomatic, best practices |
| DeepSeek V3.1 | 1.5s | ⭐⭐⭐⭐⭐ | Production-ready, well-tested |
| GPT-OSS | 0.8s | ⭐⭐⭐⭐ | Solid, functional |
| GLM 4.5 | 1.8s | ⭐⭐⭐⭐ | Good, slightly verbose |
| DeepSeek R1 | 2.0s | ⭐⭐⭐⭐ | Excellent logic, lengthy |
| Kimi K2 | 0.9s | ⭐⭐⭐⭐ | Clean and efficient |

### Creative Writing (200-word story)

| Model | Avg Time | Quality | Comments |
|-------|----------|---------|----------|
| GLM 4.5 | 1.5s | ⭐⭐⭐⭐⭐ | Most engaging, culturally rich |
| Kimi K2 | 1.0s | ⭐⭐⭐⭐ | Well-structured narratives |
| GPT-OSS | 1.2s | ⭐⭐⭐⭐ | Consistent quality |
| DeepSeek V3.1 | 1.4s | ⭐⭐⭐⭐ | Balanced and creative |
| Qwen 3 Coder | 1.8s | ⭐⭐⭐ | Tends toward technical |
| DeepSeek R1 | 2.2s | ⭐⭐⭐ | Logical but less creative |

### Reasoning (Multi-step math problem)

| Model | Avg Time | Quality | Comments |
|-------|----------|---------|----------|
| DeepSeek R1 | 2.5s | ⭐⭐⭐⭐⭐ | Most thorough explanations |
| Qwen 3 Coder | 1.5s | ⭐⭐⭐⭐⭐ | Clear, step-by-step |
| DeepSeek V3.1 | 1.8s | ⭐⭐⭐⭐ | Accurate and detailed |
| Kimi K2 | 1.2s | ⭐⭐⭐⭐ | Fast and correct |
| GLM 4.5 | 2.0s | ⭐⭐⭐ | Good but verbose |
| GPT-OSS | 1.3s | ⭐⭐⭐ | Correct, less detailed |

### Document Analysis (5000-word document)

| Model | Avg Time | Quality | Comments |
|-------|----------|---------|----------|
| Kimi K2 | 1.8s | ⭐⭐⭐⭐⭐ | Best long-context handling |
| DeepSeek V3.1 | 2.2s | ⭐⭐⭐⭐ | Thorough and accurate |
| Qwen 3 Coder | 2.5s | ⭐⭐⭐⭐ | Great for technical docs |
| GLM 4.5 | 2.4s | ⭐⭐⭐⭐ | Good comprehension |
| DeepSeek R1 | 3.0s | ⭐⭐⭐⭐ | Analytical depth |
| GPT-OSS | N/A | N/A | Context limit (32K) |

---

## Pricing Comparison

### Single Model Query

**All models: $0.01 USDC per request**

- No token-based pricing complexity
- Predictable costs
- No hidden fees
- Instant settlement via x402

### Multi-Model Query

**$0.06 USDC per request**

Query all 6 models in parallel:
- Compare responses across models
- Ensemble voting for critical tasks
- A/B testing model performance
- Redundancy and reliability

### Cost Examples

**Typical Usage Patterns:**

| Use Case | Requests/Day | Model | Monthly Cost |
|----------|--------------|-------|--------------|
| Personal chatbot | 50 | Any single model | $15.00 |
| Dev assistant | 100 | Qwen 3 Coder | $30.00 |
| Content generator | 200 | GLM 4.5 | $60.00 |
| Research tool | 30 | Kimi K2 | $9.00 |
| Code reviewer | 150 | DeepSeek V3.1 | $45.00 |
| High volume API | 1000 | GPT-OSS | $300.00 |
| Model comparison | 20 | Multi-model | $36.00 |

---

## Model Selection Guide

### Choose **Qwen 3 Coder 480B** for:
- 🔨 Software development projects
- 🐛 Code debugging and review
- 📚 Technical documentation
- ⚡ Algorithm implementation

### Choose **GLM 4.5** for:
- 🌍 Multilingual applications
- ✍️ Creative writing
- 🎨 Content generation
- 💬 Natural conversation

### Choose **GLM 4.6** for:
- 🧠 Advanced reasoning tasks
- 🌏 Complex multilingual projects
- ✨ High-quality creative content
- 🔄 Sophisticated cross-cultural communication
- 💡 Problems requiring nuanced understanding

### Choose **Kimi K2 Instruct** for:
- 📄 Long document analysis
- 🔬 Research synthesis
- 📋 Contract review
- 📊 Report generation

### Choose **DeepSeek R1 0528** for:
- 🧮 Mathematical problems
- 🔬 Scientific reasoning
- 🎓 Educational tutoring
- 🧩 Complex logic puzzles

### Choose **DeepSeek V3.1** for:
- 🚀 Production applications
- 🏗️ System architecture
- 💼 Enterprise use cases
- ⚖️ Balanced general purpose

### Choose **GPT-OSS 120B** for:
- ⚡ High-speed applications
- 📈 Scalable services
- 💬 Customer support
- 🔄 Real-time responses

### Choose **Multi-Model** for:
- 🔬 Quality comparison
- 🎯 Critical decisions
- 🧪 A/B testing
- 🛡️ Redundancy needs

---

## Technical Specifications

### Model Architectures

| Model | Architecture Type | Training Method |
|-------|------------------|-----------------|
| Qwen 3 Coder | Mixture of Experts | Supervised + RLHF |
| GLM 4.5 | GLM (Bidirectional) | Pre-training + Fine-tuning |
| Kimi K2 | Transformer | Supervised + Long Context |
| DeepSeek R1 | Transformer | Reinforcement Learning |
| DeepSeek V3.1 | Mixture of Experts | Multi-stage Training |
| GPT-OSS | GPT Architecture | Standard Pre-training |

---

## Support

For questions about model selection or performance:

- **Support**: [x.ai/jatevoid](https://x.ai/jatevoid)
- **Documentation**: [API Reference](./API_REFERENCE.md) | [README](../README.md)
