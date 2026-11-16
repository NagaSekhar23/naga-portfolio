import type { EducationItem } from "./types";

export const education: EducationItem[] = [
  {
    id: "uab",
    degree: "M.S., Data Science",
    institution: "University of Alabama at Birmingham",
    location: "Birmingham, AL",
    graduated: "Dec 2025",
    gpa: "3.7 / 4.0",
    notes: [
      "Capstone: enterprise-grade backend service on SQLAlchemy with a strict router → service → repository pattern; pharmaceutical pricing intelligence and optimization (XGBoost, Gurobi, OR-Tools).",
    ],
  },
  {
    id: "bennett",
    degree: "B.Tech, Computer Science",
    institution: "Bennett University",
    location: "India",
    graduated: "May 2023",
    gpa: "3.5 / 4.0",
    notes: [
      "Vice President, AI Research Club (through 2023): led AI/ML research initiatives, ran monthly workshops for students across majors, and mentored underclassmen.",
    ],
  },
];

export const coursework: string[] = [
  "Data Structures & Algorithms",
  "Operating Systems",
  "Computer Networks",
  "Distributed Systems",
  "Database Systems",
  "Software Engineering",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Statistical Modeling",
  "Experimental Design",
  "Stochastic Calculus",
  "Numerical Methods",
  "Optimization",
  "Financial Data Science",
  "Cloud Computing",
  "Data Engineering",
];
