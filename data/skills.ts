import type { SkillGroup } from "./types";

/** Add a skill by appending to a group's `skills`; add a group by adding an object. */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    skills: ["Python", "Java", "C/C++", "Go", "SQL", "TypeScript", "JavaScript", "C#", "R", "Scala", "MATLAB", "Bash"],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    skills: [
      "Microservices", "Domain-Driven Design", "Event-Driven Architecture", "REST", "gRPC", "GraphQL",
      "WebSockets", "FastAPI", "Flask", "Spring Boot", "Node.js", "NestJS", "ASP.NET Core", "JWT/OAuth2", "RBAC",
    ],
  },
  {
    id: "streaming",
    title: "Distributed Systems & Streaming",
    skills: [
      "Apache Kafka", "Apache Flink", "AWS SQS", "Redis", "Elasticsearch", "Exactly-Once Processing",
      "Rate Limiting", "Circuit Breakers", "High Availability", "Multi-Region Active-Active",
    ],
  },
  {
    id: "ai",
    title: "AI, LLMs & Agents",
    skills: [
      "LangChain", "LangGraph", "LlamaIndex", "CrewAI", "RAG", "GraphRAG", "Hybrid Search", "pgvector",
      "Pinecone", "FAISS", "Tool Calling", "MCP", "Multi-Agent Orchestration", "QLoRA Fine-Tuning",
      "Claude", "OpenAI GPT-4o", "Gemini", "Llama", "Mistral", "Hugging Face",
    ],
  },
  {
    id: "llm-eval",
    title: "LLM Evaluation & Safety",
    skills: [
      "DeepEval", "LLM-as-a-Judge", "Golden & Red-Team Sets", "Prompt-Injection Testing", "Guardrails AI",
      "Hallucination Detection", "Human-in-the-Loop", "Audit Logging", "CI Release Gates",
    ],
  },
  {
    id: "ml",
    title: "Machine & Deep Learning",
    skills: [
      "PyTorch", "TensorFlow/Keras", "scikit-learn", "XGBoost", "LightGBM", "Graph Neural Networks",
      "CNNs", "Transformers", "LSTMs", "YOLOv5", "OpenCV", "SHAP", "EconML",
    ],
  },
  {
    id: "mlops",
    title: "MLOps & Model Optimization",
    skills: [
      "MLflow", "Kubeflow", "Vertex AI", "Azure ML", "SageMaker", "Evidently", "KS/PSI Drift Detection",
      "TensorRT", "ONNX", "CUDA", "INT8 Quantization", "Pruning", "Knowledge Distillation",
    ],
  },
  {
    id: "data",
    title: "Data Engineering",
    skills: [
      "Apache Spark", "Databricks", "Airflow", "dbt", "Snowflake", "BigQuery", "Redshift", "Delta Lake",
      "Great Expectations", "Azure Data Factory", "AWS Glue", "Dimensional Modeling",
    ],
  },
  {
    id: "databases",
    title: "Databases & Search",
    skills: ["PostgreSQL", "PostGIS", "SQL Server", "MongoDB", "Redis", "Elasticsearch", "DynamoDB", "Cassandra", "SQLite"],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    skills: [
      "AWS (EKS, Lambda, S3, SQS)", "Azure (AKS, Azure ML)", "GCP (Cloud Run, Vertex AI)", "Kubernetes",
      "Docker", "Helm", "Istio", "Terraform", "Argo CD", "GitHub Actions", "GitLab CI", "Vercel", "Linux",
    ],
  },
  {
    id: "observability",
    title: "Observability & Reliability",
    skills: [
      "OpenTelemetry", "Prometheus", "Grafana", "Jaeger", "Distributed Tracing", "SLOs/SLIs",
      "Error Budgets", "Chaos Engineering (Litmus)", "On-Call Response", "Runbooks",
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Leaflet", "Plotly", "Streamlit", "Gradio"],
  },
  {
    id: "quant",
    title: "Quantitative Finance & Statistics",
    skills: [
      "Backtesting", "Factor Models", "Mean-Variance Optimization", "Options Pricing", "Value-at-Risk",
      "Hypothesis & A/B Testing", "Bayesian Inference", "Causal Inference", "Monte Carlo Simulation",
      "Gurobi", "OR-Tools",
    ],
  },
  {
    id: "systems",
    title: "Systems & Embedded",
    skills: ["C++17/20", "CMake", "CTest", "Simulink", "MPI", "Embedded Linux", "Concurrency", "GPU/CPU Profiling"],
  },
  {
    id: "bio-gis",
    title: "Bioinformatics & Geospatial",
    skills: ["Multi-Omics Integration", "Proteogenomics (CPTAC, TCGA)", "Pathway Analysis", "PostGIS", "GeoPandas", "ArcGIS", "QGIS"],
  },
  {
    id: "practice",
    title: "Ways of Working",
    skills: [
      "Agile/Scrum (SAFe)", "Code review on every change", "Test-first quality gates", "Design docs & runbooks",
      "Requirements discovery", "Claude Code", "GitHub Copilot", "Cursor",
    ],
  },
];
