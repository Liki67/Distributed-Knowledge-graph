// Mock data for development without backend

export const mockTopics = [
  {
    id: "topic-1",
    name: "Sustainable Farming Basics",
    description: "Learn fundamental sustainable agricultural practices for small-scale farmers",
    category: "agriculture",
    difficulty_level: "beginner",
    keywords: ["farming", "sustainability", "agriculture", "basics"],
    related_topics: ["topic-2", "topic-3"]
  },
  {
    id: "topic-2",
    name: "Water Conservation Techniques",
    description: "Efficient water usage and management strategies for agriculture",
    category: "agriculture",
    difficulty_level: "intermediate",
    keywords: ["water", "conservation", "irrigation", "efficiency"],
    related_topics: ["topic-1", "topic-7"]
  },
  {
    id: "topic-3",
    name: "Crop Rotation Methods",
    description: "Understanding and implementing crop rotation for soil health",
    category: "agriculture",
    difficulty_level: "beginner",
    keywords: ["crops", "rotation", "soil", "health"],
    related_topics: ["topic-1"]
  },
  {
    id: "topic-4",
    name: "Organic Pest Control",
    description: "Natural methods for managing pests without harmful chemicals",
    category: "agriculture",
    difficulty_level: "intermediate",
    keywords: ["organic", "pests", "natural", "control"],
    related_topics: ["topic-1"]
  },
  {
    id: "topic-5",
    name: "Basic Financial Literacy",
    description: "Essential money management skills for everyday life",
    category: "practical_skills",
    difficulty_level: "beginner",
    keywords: ["money", "budgeting", "savings", "finance"],
    related_topics: []
  },
  {
    id: "topic-6",
    name: "Solar Energy Basics",
    description: "Introduction to solar power and its applications",
    category: "technology",
    difficulty_level: "beginner",
    keywords: ["solar", "energy", "renewable", "power"],
    related_topics: ["topic-7"]
  },
  {
    id: "topic-7",
    name: "Water Pump Maintenance",
    description: "How to maintain and repair common water pumps",
    category: "practical_skills",
    difficulty_level: "intermediate",
    keywords: ["pump", "water", "maintenance", "repair"],
    related_topics: ["topic-2", "topic-6"]
  },
  {
    id: "topic-8",
    name: "English Communication Skills",
    description: "Basic English conversation for everyday situations",
    category: "language",
    difficulty_level: "beginner",
    keywords: ["english", "communication", "language", "speaking"],
    related_topics: []
  }
];

export const mockResources = [
  {
    id: "resource-1",
    title: "Introduction to Sustainable Farming",
    content: "Sustainable farming focuses on producing food while preserving the environment. Key principles include soil health, water conservation, and biodiversity.",
    resource_type: "article",
    difficulty_level: "beginner",
    estimated_time_minutes: 15,
    offline_available: true,
    tags: ["farming", "beginner", "guide", "sustainable"],
    topic_ids: ["topic-1"],
    created_date: "2024-01-15"
  },
  {
    id: "resource-2",
    title: "Water-Saving Irrigation Techniques",
    content: "Drip irrigation and mulching can reduce water usage by up to 50%. Learn how to implement these cost-effective methods.",
    resource_type: "video_link",
    difficulty_level: "intermediate",
    estimated_time_minutes: 20,
    offline_available: false,
    tags: ["water", "irrigation", "conservation"],
    source_url: "https://example.com/water-saving-video",
    topic_ids: ["topic-2"],
    created_date: "2024-01-20"
  },
  {
    id: "resource-3",
    title: "Crop Rotation Planning Guide",
    content: "A step-by-step guide to planning crop rotation for small farms. Includes seasonal calendars and crop family groupings.",
    resource_type: "tutorial",
    difficulty_level: "beginner",
    estimated_time_minutes: 30,
    offline_available: true,
    tags: ["crops", "planning", "rotation", "guide"],
    topic_ids: ["topic-3"],
    created_date: "2024-02-01"
  },
  {
    id: "resource-4",
    title: "Natural Pest Control Methods",
    content: "Discover organic alternatives to chemical pesticides. Learn about companion planting and beneficial insects.",
    resource_type: "article",
    difficulty_level: "intermediate",
    estimated_time_minutes: 25,
    offline_available: true,
    tags: ["organic", "pests", "natural"],
    topic_ids: ["topic-4"],
    created_date: "2024-02-10"
  },
  {
    id: "resource-5",
    title: "Budgeting Basics",
    content: "Learn how to track income and expenses, create a simple budget, and start saving for the future.",
    resource_type: "tutorial",
    difficulty_level: "beginner",
    estimated_time_minutes: 20,
    offline_available: true,
    tags: ["money", "budgeting", "savings"],
    topic_ids: ["topic-5"],
    created_date: "2024-02-15"
  },
  {
    id: "resource-6",
    title: "Solar Panel Basics",
    content: "Understanding how solar panels work, their benefits, and basic installation considerations for rural areas.",
    resource_type: "article",
    difficulty_level: "beginner",
    estimated_time_minutes: 15,
    offline_available: true,
    tags: ["solar", "energy", "renewable"],
    topic_ids: ["topic-6"],
    created_date: "2024-02-20"
  }
];

export const mockPaths = [
  {
    id: "path-1",
    name: "New Farmer Starter Guide",
    description: "Complete learning path for aspiring farmers with no prior experience",
    category: "agriculture",
    difficulty_level: "beginner",
    target_audience: "New farmers in rural areas",
    estimated_duration_hours: 40,
    sequence: [
      { step: 1, topic_id: "topic-1", description: "Start with sustainable farming basics" },
      { step: 2, topic_id: "topic-3", description: "Learn about crop rotation" },
      { step: 3, topic_id: "topic-2", description: "Understand water conservation" },
      { step: 4, topic_id: "topic-4", description: "Master organic pest control" }
    ]
  },
  {
    id: "path-2",
    name: "Essential Life Skills",
    description: "Practical skills for everyday life and self-sufficiency",
    category: "practical_skills",
    difficulty_level: "beginner",
    target_audience: "Adults seeking practical knowledge",
    estimated_duration_hours: 20,
    sequence: [
      { step: 1, topic_id: "topic-5", description: "Start with financial literacy" },
      { step: 2, topic_id: "topic-8", description: "Learn basic English communication" },
      { step: 3, topic_id: "topic-7", description: "Understand basic maintenance skills" }
    ]
  },
  {
    id: "path-3",
    name: "Sustainable Technology Basics",
    description: "Introduction to renewable energy and appropriate technology",
    category: "technology",
    difficulty_level: "beginner",
    target_audience: "Rural communities interested in sustainable tech",
    estimated_duration_hours: 15,
    sequence: [
      { step: 1, topic_id: "topic-6", description: "Learn about solar energy" },
      { step: 2, topic_id: "topic-7", description: "Understand water pump systems" },
      { step: 3, topic_id: "topic-2", description: "Apply knowledge to water management" }
    ]
  }
];

export const mockKnowledgeGraph = {
  nodes: [
    { id: "topic-1", name: "Sustainable Farming", type: "topic", category: "agriculture", resourceCount: 1 },
    { id: "topic-2", name: "Water Conservation", type: "topic", category: "agriculture", resourceCount: 1 },
    { id: "topic-3", name: "Crop Rotation", type: "topic", category: "agriculture", resourceCount: 1 },
    { id: "topic-4", name: "Pest Control", type: "topic", category: "agriculture", resourceCount: 1 },
    { id: "topic-5", name: "Financial Literacy", type: "topic", category: "practical_skills", resourceCount: 1 },
    { id: "topic-6", name: "Solar Energy", type: "topic", category: "technology", resourceCount: 1 },
    { id: "topic-7", name: "Pump Maintenance", type: "topic", category: "practical_skills", resourceCount: 0 },
    { id: "topic-8", name: "English Skills", type: "topic", category: "language", resourceCount: 0 }
  ],
  links: [
    { source: "topic-1", target: "topic-2", relationship: "RELATED_TO", value: 1 },
    { source: "topic-1", target: "topic-3", relationship: "RELATED_TO", value: 1 },
    { source: "topic-1", target: "topic-4", relationship: "RELATED_TO", value: 1 },
    { source: "topic-2", target: "topic-7", relationship: "RELATED_TO", value: 1 },
    { source: "topic-6", target: "topic-7", relationship: "RELATED_TO", value: 1 }
  ]
};