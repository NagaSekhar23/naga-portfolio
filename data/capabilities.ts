import type { CapabilityTheme } from "./types";

/**
 * Capability themes shown on /engineering, /applied-ai and /data-ml.
 * Every item is drawn from the master resume or a verified public project (see REVIEW_FLAGS.md).
 * Link an item to project slugs with `projectIds` and to a role with `experienceId`.
 */
export const capabilities: CapabilityTheme[] = [
  // ───────── Software Engineering ─────────
  {
    id: "eng-distributed",
    area: "engineering",
    title: "Distributed systems & microservices",
    summary: "Services designed to be owned, deployed and scaled independently.",
    items: [
      {
        text: "Achieved 99.997% uptime and independent per-service deployment by solely owning the re-architecture of a monolithic transaction platform into 8 domain-driven microservices on Kubernetes (AWS EKS).",
        experienceId: "nexbyte",
      },
      {
        text: "Increased inter-service throughput 44%, cut payload size 60% and infrastructure cost 35% by migrating 8 core services from REST/JSON to gRPC/Protocol Buffers with request batching.",
        experienceId: "nexbyte",
      },
      {
        text: "Sustained 50,000+ requests/second at 99.99% uptime across 10+ microservices with token-bucket rate limiting, circuit breakers and JWT/RBAC authentication in async Python.",
        projectIds: ["api-gateway"],
      },
    ],
  },
  {
    id: "eng-streaming",
    area: "engineering",
    title: "Streaming & event-driven systems",
    summary: "Real-time pipelines with exactly-once semantics and explicit latency budgets.",
    items: [
      {
        text: "Delivered sub-second listing updates to 1,000+ concurrent users with an exactly-once Kafka and Flink pipeline unifying 50+ sources into Snowflake.",
        experienceId: "nexbyte",
      },
      {
        text: "Processed 500K+ events/hour at 91% precision and 12ms p99 with an exactly-once Kafka + Flink pipeline and a Redis feature store serving 200+ features in under 5ms.",
        projectIds: ["fraud-detection"],
      },
      {
        text: "Built critical modules of a real-time, event-driven inventory-tracking system (Java, Spring Boot, Kafka, PostgreSQL) processing 800K+ stock-movement events daily.",
        experienceId: "jmpl",
      },
    ],
  },
  {
    id: "eng-performance",
    area: "engineering",
    title: "Performance, search & caching",
    summary: "Latency problems found with profiling and fixed at the root.",
    items: [
      {
        text: "Cut geospatial search latency 14x (p95 900ms to 65ms) by root-causing a live production bottleneck and rebuilding search as a standalone Elasticsearch service with custom geo-polygon scoring.",
        experienceId: "nexbyte",
      },
      {
        text: "Cut p99 API latency from 780ms to 95ms and database read load 52% at 10K requests/second with a Redis-backed distributed cache.",
        experienceId: "jmpl",
      },
      {
        text: "Cut p99 API latency 90% for 10,000+ daily active users at 99.9% uptime by analyzing SQL execution plans, redesigning schemas and adding compound indexes and Redis caching.",
        experienceId: "echelonkryo",
      },
    ],
  },
  {
    id: "eng-reliability",
    area: "engineering",
    title: "Cloud infrastructure & reliability",
    summary: "Infrastructure as code, observability and failure testing.",
    items: [
      {
        text: "Reduced East Coast API latency 31% for latency-sensitive and model-inference workloads by designing multi-region active-active AWS infrastructure (EKS, Lambda, S3) with Terraform.",
        experienceId: "nexbyte",
      },
      {
        text: "Proved 99.99% availability with a 15-minute RTO by running 12+ Litmus chaos experiments and multi-region failover tests against SLO/SLI error budgets.",
        projectIds: ["k8s-chaos"],
      },
      {
        text: "Cut mean time to detect and debug incidents 40% with OpenTelemetry distributed tracing, Prometheus metrics, Grafana dashboards and CloudWatch alerting.",
        experienceId: "nexbyte",
      },
    ],
  },
  {
    id: "eng-systems",
    area: "engineering",
    title: "Systems & embedded",
    summary: "Real-time and resource-constrained software in C++.",
    items: [
      {
        text: "Ran a deterministic 100Hz (10 ms) real-time loop with a modular C++17 engine and a drift-free std::chrono absolute-deadline harness, backed by 21 CTest and pytest regression tests.",
        projectIds: ["aerosim-core"],
      },
      {
        text: "Achieved 92% mAP at 30 FPS on embedded Linux hardware by deploying a YOLOv5 detector through a custom C++ inference engine.",
        experienceId: "nus",
      },
    ],
  },
  {
    id: "eng-fullstack",
    area: "engineering",
    title: "Full-stack products",
    summary: "End-to-end applications built around real users' workflows.",
    items: [
      {
        text: "Reached 500+ beta users with a multi-tenant SaaS: React frontend, Stripe subscriptions, JWT/OAuth2 authentication and live WebSocket collaboration, deployed through CI/CD on AWS.",
        projectIds: ["analytics-saas"],
      },
      {
        text: "Replaced spreadsheets and one-off scripts with one platform for XML validation, database exploration, EDI workflows and QA management, built around OTM analysts' workflow.",
        projectIds: ["otmos"],
      },
    ],
  },
  {
    id: "eng-practice",
    area: "engineering",
    title: "Engineering practice",
    summary: "Quality gates, code review and disciplined use of AI-assisted tools.",
    items: [
      {
        text: "Shipped every change safely in Agile/Scrum sprints with GitHub Actions CI/CD for Dockerized REST and gRPC services, unit and integration tests, and code review on every pull request.",
        experienceId: "nexbyte",
      },
      {
        text: "Prevented production connection-pool exhaustion by reviewing Claude Code–generated stream-consumer code, catching an N+1 database-call defect, and refactoring it into a backpressure-aware, chunked bulk-upsert path before release.",
        experienceId: "nexbyte",
      },
      {
        text: "Cut deployment time 50% and reached 75%+ test coverage on core endpoints with Docker/GitHub Actions CI/CD and pytest suites.",
        experienceId: "echelonkryo",
      },
    ],
  },

  // ───────── Applied AI ─────────
  {
    id: "llm-agents",
    area: "applied-ai",
    title: "LLM applications & AI agents",
    summary: "Language-model features built as governed services, with tool use and human approval where it matters.",
    items: [
      {
        text: "Built an LLM extraction service (Claude API, LangChain, Pydantic structured outputs) that cut lease-agreement turnaround 70% across 15K+ uploads/day, routing low-confidence parses to human review.",
        experienceId: "nexbyte",
      },
      {
        text: "Built ManagerLens, an evidence-first agent using allowlisted tool calls over Jira, GitHub and feedback, separating observed facts from assumptions before recommending actions.",
        projectIds: ["managerlens"],
      },
      {
        text: "Built an autonomous coding agent that writes, tests and debugs Python in a code-execution sandbox with self-correcting feedback loops (78% first-pass task completion).",
        projectIds: ["coding-agent"],
      },
    ],
  },
  {
    id: "multi-agent",
    area: "applied-ai",
    title: "Multi-agent systems & orchestration",
    summary: "Specialized agents coordinated through explicit planners, validators and dependency-aware execution.",
    items: [
      {
        text: "Architected a multi-agent pipeline (Planner, Extractor, Validator) in Python with LangGraph and asyncio, including error recovery and retries, for mortgage and payroll document review.",
        experienceId: "outmation",
      },
      {
        text: "Built an orchestrator that decomposes tasks and dispatches them to specialized agents with parallel execution, Redis-backed memory and human-in-the-loop escalation.",
        projectIds: ["multi-agent-orchestrator"],
      },
      {
        text: "Built an enterprise action engine that converts natural-language requests into governed API workflows, with RBAC, human approval gates, sandboxed execution and audit logging.",
        projectIds: ["action-engine"],
      },
    ],
  },
  {
    id: "rag",
    area: "applied-ai",
    title: "Retrieval-Augmented Generation (RAG)",
    summary: "Retrieval designed and measured end to end: chunking, hybrid search, reranking and grounding checks.",
    items: [
      {
        text: "Reached 94% retrieval accuracy over 10,000+ enterprise documents using hybrid BM25 + vector search on pgvector with HNSW indexing.",
        projectIds: ["multi-agent-rag"],
      },
      {
        text: "Benchmarked GraphRAG against a TF-IDF RAG baseline on a 14-question benchmark, measuring a 33% relative retrieval gain (0.48 vs 0.36) with 57 automated tests in CI.",
        projectIds: ["bioos"],
      },
      {
        text: "Raised citation grounding from 68% to 85% on a 200-sample ground-truth benchmark by routing each document type to specialized extractors.",
        experienceId: "outmation",
      },
    ],
  },
  {
    id: "automation",
    area: "applied-ai",
    title: "AI-powered automation",
    summary: "Automation with explicit guardrails: thresholds, compliance checks and self-healing workflows.",
    items: [
      {
        text: "Built a voice agent with hard payment-plan guardrails ($50–$500) and a DeepEval suite that gates each deploy on legally required disclosures.",
        projectIds: ["voice-agent"],
      },
      {
        text: "Built an LLM-powered data-quality system that detects schema drift and outliers and runs self-healing workflows, cutting manual data triage 60%.",
        projectIds: ["dq-monitoring"],
      },
      {
        text: "Built an LLM fine-tuning and evaluation pipeline (QLoRA, LLM-as-a-Judge, semantic routing) that matches model choice to cost and quality per use case.",
        projectIds: ["llm-alignment"],
      },
    ],
  },
  {
    id: "evaluation",
    area: "applied-ai",
    title: "Model evaluation & observability",
    summary: "Quality is measured before release and watched after it: golden sets, CI gates, drift and tracing.",
    items: [
      {
        text: "Built golden-set and adversarial evaluations (DeepEval) for LLM features, with schema validation and latency and cost tracking that gate every prompt or model change in CI.",
        experienceId: "nexbyte",
      },
      {
        text: "Built an evaluation framework for 2–3 LLMs across 50–100 test cases and 15+ metrics, reporting confidence intervals and failure-analysis dashboards.",
        projectIds: ["ai-eval-framework"],
      },
      {
        text: "Cut mean time to detect and debug incidents 40% with OpenTelemetry tracing, Prometheus metrics, Grafana dashboards and CloudWatch alerting.",
        experienceId: "nexbyte",
      },
    ],
  },
  {
    id: "production",
    area: "applied-ai",
    title: "Production-ready AI applications",
    summary: "AI shipped as running services, with the same engineering discipline as any production system.",
    items: [
      {
        text: "Shipped a production LLMOps platform with automated evaluation, A/B testing, progressive rollout and rollback across 10+ models, cutting the model-update cycle from 2 weeks to 4 hours.",
        projectIds: ["llmops"],
      },
      {
        text: "Deployed ManagerLens on Docker, Vercel, Google Cloud Run and Neon, and an otmOS live demo that uses the Claude API to repair invalid payloads and guide SQL building.",
        projectIds: ["managerlens", "otmos"],
      },
      {
        text: "Shipped a production Gradio chatbot giving reviewers citation-backed answers over 100+ page mortgage documents, iterated from user feedback.",
        experienceId: "outmation",
      },
    ],
  },

  // ───────── Data Science & Machine Learning ─────────
  {
    id: "ml-dl",
    area: "data-ml",
    title: "Machine learning & deep learning",
    summary: "Models built for real constraints: streaming latency, edge hardware and biological data.",
    items: [
      {
        text: "Achieved 82% accuracy in immunotherapy target prediction, 14% above an XGBoost baseline, using pathway-aware Graph Neural Networks on 5,000+ patient multi-omics datasets.",
        experienceId: "uab-huang-lab",
      },
      {
        text: "Built a streaming fraud detection engine with an XGBoost + Isolation Forest ensemble, SHAP attributions and 12ms p99 latency. Placed Top 15 of 100+ teams at Georgia Tech Hackalytics 2025.",
        projectIds: ["fraud-detection"],
      },
      {
        text: "Achieved 3.5x faster inference with under 1% accuracy loss by combining INT8/FP16 quantization, pruning and distillation.",
        projectIds: ["nn-compression"],
      },
    ],
  },
  {
    id: "data-analytics",
    area: "data-ml",
    title: "Data engineering & intelligent analytics",
    summary: "Pipelines and warehouses that deliver trustworthy, queryable data for product and ML teams.",
    items: [
      {
        text: "Delivered sub-second listing updates to 1,000+ concurrent users with an exactly-once Kafka and Flink pipeline unifying 50+ sources into Snowflake.",
        experienceId: "nexbyte",
      },
      {
        text: "Deployed a star-schema Snowflake warehouse with 50+ production dbt models and Airflow DAGs enforcing lineage and data-quality checks, supporting 10,000+ daily analytics queries.",
        projectIds: ["data-warehouse"],
      },
      {
        text: "Unified 50+ heterogeneous sources (APIs, databases, files) with a validated Spark pipeline, dataset freshness and accuracy SLAs, automated validation and alerting.",
        projectIds: ["data-integration"],
      },
    ],
  },
  {
    id: "stats",
    area: "data-ml",
    title: "Statistics, experimentation & causal inference",
    summary: "Claims backed by tests, intervals and held-out validation.",
    items: [
      {
        text: "Lifted user engagement 15% by designing and analyzing an A/B testing framework (chi-squared tests, t-tests, Bayesian confidence intervals) with SQL analytics.",
        experienceId: "echelonkryo",
      },
      {
        text: "Confirmed out-of-sample generalization across 3 cancer subtypes by framing hypotheses, engineering features, and validating with significance tests, confidence intervals and cross-validation.",
        experienceId: "uab-huang-lab",
      },
      {
        text: "Estimating heterogeneous treatment effects with causal forests (EconML, LightGBM) on IHDP and Jobs benchmarks, extending to confounded multi-omics data (in progress).",
        projectIds: ["causal-effects"],
      },
    ],
  },
  {
    id: "mlops",
    area: "data-ml",
    title: "MLOps, drift & monitoring",
    summary: "Models kept honest after deployment.",
    items: [
      {
        text: "Cut unnecessary model retraining 50% while catching real distribution shifts early with Kolmogorov-Smirnov and Population Stability Index drift detection and retraining triggers.",
        experienceId: "nexbyte",
      },
      {
        text: "Served 200+ features at sub-5ms latency to the valuation model through a real-time feature store on Kafka, Flink and Redis.",
        experienceId: "nexbyte",
      },
      {
        text: "Automated train, evaluate and deploy on every push with a Kubeflow Vertex pipeline, Model Registry versioning and Evidently drift monitoring.",
        projectIds: ["vertex-ml-platform"],
      },
    ],
  },
  {
    id: "quant",
    area: "data-ml",
    title: "Quantitative research",
    summary: "Systematic strategy research with attention to look-ahead bias and overfitting.",
    items: [
      {
        text: "Built a vectorized backtester across 500+ assets (2010–2023) with commission, slippage, market-impact and partial-fill modeling; fixed a look-ahead bias bug that leaked future data, and improved Sharpe ratio 15%.",
        projectIds: ["backtester"],
      },
      {
        text: "Maximized Sharpe ratio under position and risk limits across 50+ equities with a multi-factor model and constrained mean-variance optimization, validated by a 3-year backtest.",
        projectIds: ["portfolio-optimization"],
      },
    ],
  },
  {
    id: "science-ml",
    area: "data-ml",
    title: "Scientific & biomedical ML",
    summary: "Interpretable models and open data for biological research.",
    items: [
      {
        text: "Predicted binding-affinity shifts for 450+ variants at 0.86 AUROC against validated assays with a PyTorch model over patient-specific signaling networks (TCGA + CPTAC, 10+ cancer types).",
        experienceId: "uab-huang-lab",
      },
      {
        text: "Integrated and standardized 4 public biomedical databases (DisGeNET, STRING, DrugBank, SIDER) into one interoperable open dataset (CC BY 4.0).",
        projectIds: ["pharmalchemy"],
      },
      {
        text: "Co-authored “Pathway-guided architectures for interpretable AI in biological research” in Computational and Structural Biotechnology Journal (2025).",
        experienceId: "uab-huang-lab",
      },
    ],
  },
  {
    id: "decision-analytics",
    area: "data-ml",
    title: "Decision analytics",
    summary: "Models and dashboards that end in a decision.",
    items: [
      {
        text: "Enabled data-driven selection of Braven's top 50 expansion targets by standardizing 10,000+ multi-source records, ranking 50+ university partners and delivering an interactive Power BI dashboard.",
        experienceId: "jpmc-cfg",
      },
      {
        text: "Reached a simulated 8–12% margin gain on held-out data by forecasting demand with XGBoost and solving a Gurobi/OR-Tools mixed-integer price optimization.",
        projectIds: ["pricing-capstone"],
      },
    ],
  },
];
