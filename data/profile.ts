import type { Profile } from "./types";

export const profile: Profile = {
  name: "Naga Sekhar Madala",
  headline: "Building Intelligent Systems. Engineering Real-World Solutions.",
  introduction:
    "I'm Naga Sekhar Madala, a Software Engineer focused on Applied AI, Machine Learning, and Data Science. I build intelligent applications, AI-powered systems, scalable software, and data-driven solutions that turn complex problems into practical products.",
  disciplines: [
    { title: "Applied AI & AI Engineering", description: "LLM applications, AI agents, RAG and evaluation-gated releases.", href: "/applied-ai" },
    { title: "Software Engineering", description: "Distributed services, APIs, cloud infrastructure and production reliability.", href: "/engineering" },
    { title: "Machine Learning & Deep Learning", description: "Models from feature engineering through drift monitoring and edge deployment.", href: "/data-ml" },
    { title: "Data Science & Analytics", description: "Streaming and warehouse data pipelines, statistics and decision-ready analysis.", href: "/data-ml" },
  ],
  roles: ["Software Engineer", "AI/ML Engineer", "Data Engineer", "Quantitative Researcher"],
  location: "Atlanta, GA",
  availability: "Open to relocation, hybrid and on-site roles",
  email: "madalanagasekhar@gmail.com",
  summary:
    "Software and AI engineer with production experience across distributed systems, real-time data pipelines, LLM applications, and peer-reviewed ML research.",
  about: [
    "I'm a software and AI engineer with production experience across distributed systems, real-time data pipelines, LLM applications, and peer-reviewed machine learning research.",
    "At Nexbyte I solely own the re-architecture of a monolithic real-estate transaction platform into 8 domain-driven microservices on Kubernetes, alongside Kafka/Flink pipelines that deliver sub-second updates to 1,000+ concurrent users and LLM services that route low-confidence results to human review.",
    "I hold an M.S. in Data Science (UAB, GPA 3.7) and a B.Tech in Computer Science, and I'm AWS, Azure and Google Cloud certified. My research spans pathway-aware graph neural networks, edge AI, and cybersecurity — with a peer-reviewed journal publication, conference papers, patent applications and two books.",
  ],
  focusAreas: [
    {
      title: "Distributed systems",
      description:
        "Event-driven microservices, Kafka/Flink streaming, gRPC, and Kubernetes platforms with SLO-driven reliability.",
    },
    {
      title: "LLM & agent engineering",
      description:
        "RAG, multi-agent orchestration and evaluation-gated releases, with confidence thresholds and human-in-the-loop review.",
    },
    {
      title: "Data & ML platforms",
      description:
        "Streaming feature stores, drift detection, Snowflake/dbt warehouses and production MLOps.",
    },
    {
      title: "Research",
      description:
        "Interpretable deep learning for biology, edge-AI model compression, quantitative finance and cybersecurity.",
    },
  ],
  domains: [
    "Real estate technology",
    "Mortgage & document intelligence",
    "Healthcare & biomedical research",
    "Quantitative finance",
    "E-commerce & inventory",
    "Edge AI",
    "Cybersecurity research",
  ],
  stats: [
    { value: "99.997%", label: "uptime on 8 owned microservices" },
    { value: "300K+", label: "daily updates processed" },
    { value: "14x", label: "faster geospatial search (p95)" },
    { value: "82%", label: "GNN accuracy, +14% vs XGBoost" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/NagaSekhar23" },
    { label: "Email", href: "mailto:madalanagasekhar@gmail.com" },
  ],
};
