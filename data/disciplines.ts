import type { DisciplinePage } from "./types";

/** Header copy, toolbox and selected work for /engineering, /applied-ai and /data-ml. */
export const disciplines: DisciplinePage[] = [
  {
    area: "engineering",
    title: "Software Engineering",
    tagline: "Distributed systems, APIs and platforms built to run in production.",
    intro:
      "My engineering work centers on backend and platform systems: domain-driven microservices on Kubernetes, event-driven pipelines on Kafka and Flink, gRPC services, and the observability and CI/CD that keep them reliable. I own services end to end, including on-call and root-cause analysis.",
    skillGroupIds: ["languages", "backend", "streaming", "databases", "cloud", "observability", "systems", "frontend", "practice"],
    projectIds: ["api-gateway", "k8s-chaos", "aerosim-core", "otmos"],
  },
  {
    area: "applied-ai",
    title: "Applied AI",
    tagline: "LLM applications and agents, engineered, measured and shipped.",
    intro:
      "Applied AI is where software engineering and machine learning meet: LLM services, retrieval and multi-agent systems built with evaluation gates, confidence thresholds and human review so they hold up in production.",
    skillGroupIds: ["ai", "llm-eval", "mlops"],
    projectIds: ["multi-agent-rag", "managerlens", "bioos", "llmops"],
  },
  {
    area: "data-ml",
    title: "Data Science & Machine Learning",
    tagline: "From pipelines and statistics to models in production.",
    intro:
      "My data and machine learning work spans streaming and warehouse pipelines, statistical modeling and experimentation, deep learning for biology and edge hardware, and quantitative research, with drift monitoring and validation built in.",
    skillGroupIds: ["ml", "data", "mlops", "quant", "bio-gis"],
    projectIds: ["fraud-detection", "data-warehouse", "backtester", "pharmalchemy"],
  },
];
