import type { CertificationGroup } from "./types";

export const certificationGroups: CertificationGroup[] = [
  {
    id: "cloud",
    title: "Cloud",
    items: [
      { name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services" },
      { name: "Azure Developer Associate", issuer: "Microsoft" },
      { name: "Associate Cloud Engineer", issuer: "Google Cloud" },
      { name: "Cloud Support Associate", issuer: "Microsoft" },
    ],
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    items: [
      { name: "Fundamentals of Accelerated Computing with CUDA Python", issuer: "NVIDIA" },
      { name: "Deep Learning Specialization", issuer: "DeepLearning.AI" },
      { name: "Generative AI with LLMs", issuer: "DeepLearning.AI" },
      { name: "AI & ML Engineering", issuer: "Microsoft" },
      { name: "Claude 101", issuer: "Anthropic" },
      { name: "AI Fluency", issuer: "Anthropic" },
    ],
  },
  {
    id: "software",
    title: "Software Engineering",
    items: [
      { name: "Python Development", issuer: "Microsoft" },
      { name: "Software Engineer", issuer: "HackerRank" },
      { name: "Software Engineering Virtual Experience", issuer: "J.P. Morgan (Forage)" },
    ],
  },
  {
    id: "quant",
    title: "Quantitative Finance",
    items: [
      { name: "Quantitative Research Virtual Experience", issuer: "J.P. Morgan (Forage)" },
      { name: "Options 101", issuer: "Akuna Capital" },
      { name: "Financial Markets", issuer: "Yale (Coursera)" },
      { name: "Machine Learning for Trading Specialization" },
    ],
  },
];
