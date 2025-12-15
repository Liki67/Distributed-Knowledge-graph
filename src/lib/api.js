import { API_BASE_URL, API_ENDPOINTS, IPFS_GATEWAY } from '@/lib/config';
import { mockTopics, mockResources, mockPaths, mockKnowledgeGraph } from '@/lib/mockData';

// Toggle this to switch between mock and real API
const USE_MOCK_DATA = true; // Set to false when backend is ready

// In-memory storage for offline progress
const offlineProgressStore = {
  data: []
};

// Helper for making API requests
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// Mock delay to simulate API
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// --- Knowledge Graph Operations ---

export async function getKnowledgeGraph() {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockKnowledgeGraph;
  }
  return apiRequest(API_ENDPOINTS.TOPIC_RELATIONSHIPS);
}

export async function getTopicsFromNeo4j() {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockTopics;
  }
  return apiRequest(API_ENDPOINTS.TOPICS);
}

export async function getTopicDetails(topicId) {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockTopics.find(t => t.id === topicId) || null;
  }
  return apiRequest(API_ENDPOINTS.TOPIC_BY_ID(topicId));
}

export async function searchTopics(query) {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const lowerQuery = query.toLowerCase();
    return mockTopics.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery)
    );
  }
  return apiRequest(API_ENDPOINTS.SEARCH, {
    method: 'POST',
    body: JSON.stringify({ query })
  });
}

// --- Learning Path Operations ---

export async function getRecommendedLearningPaths(userProfile) {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockPaths;
  }
  return apiRequest(API_ENDPOINTS.RECOMMENDED_PATHS, {
    method: 'POST',
    body: JSON.stringify({ profile: userProfile })
  });
}

export async function getLearningPathById(pathId) {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockPaths.find(p => p.id === pathId) || null;
  }
  return apiRequest(API_ENDPOINTS.PATH_BY_ID(pathId));
}

export async function getAllLearningPaths() {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockPaths;
  }
  return apiRequest(API_ENDPOINTS.LEARNING_PATHS);
}

// --- Resource Management ---

export async function getResourceFromIPFS(cid) {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return { cid, content: "Mock IPFS content" };
  }
  
  try {
    const response = await fetch(`${IPFS_GATEWAY}/ipfs/${cid}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Direct IPFS access failed, falling back to backend relay');
  }
  
  return apiRequest(API_ENDPOINTS.RESOURCE_BY_CID(cid));
}

export async function getAllResources() {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockResources;
  }
  return apiRequest(API_ENDPOINTS.RESOURCES);
}

export async function getResourceById(resourceId) {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockResources.find(r => r.id === resourceId) || null;
  }
  return apiRequest(API_ENDPOINTS.RESOURCE_BY_ID(resourceId));
}

// --- AI-Powered Search ---

export async function performAISearch(query, context = {}) {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return {
      interpretation: `Based on your query "${query}", here are personalized recommendations.`,
      recommended_topics: ["Sustainable Farming", "Water Conservation", "Crop Rotation"],
      suggested_resources: [
        "Introduction to Sustainable Farming",
        "Water-Saving Techniques",
        "Crop Rotation Guide"
      ],
      learning_path_suggestion: "Start with sustainable farming basics, then explore water management",
      related_searches: [
        "organic farming methods",
        "water conservation tips",
        "crop planning"
      ]
    };
  }
  
  return apiRequest(API_ENDPOINTS.AI_SEARCH, {
    method: 'POST',
    body: JSON.stringify({ 
      query,
      context,
      includeRecommendations: true 
    })
  });
}

// --- User Progress Tracking ---

export async function getUserProgress() {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return [];
  }
  return apiRequest(API_ENDPOINTS.USER_PROGRESS);
}

export async function updateUserProgress(progressData) {
  if (USE_MOCK_DATA) {
    await mockDelay();
    console.log('Mock: Progress updated', progressData);
    return { success: true };
  }
  return apiRequest(API_ENDPOINTS.UPDATE_PROGRESS, {
    method: 'POST',
    body: JSON.stringify(progressData)
  });
}

// --- Offline Support ---

export async function syncOfflineProgress() {
  const offlineProgress = await getOfflineProgress();
  if (offlineProgress && offlineProgress.length > 0) {
    if (USE_MOCK_DATA) {
      console.log('Mock: Syncing offline progress', offlineProgress);
      offlineProgressStore.data = [];
      return { synced: offlineProgress.length };
    }
    
    try {
      const result = await apiRequest(API_ENDPOINTS.UPDATE_PROGRESS, {
        method: 'POST',
        body: JSON.stringify({ updates: offlineProgress })
      });
      offlineProgressStore.data = [];
      return result;
    } catch (error) {
      console.error('Failed to sync offline progress:', error);
      throw error;
    }
  }
  return { synced: 0 };
}

async function getOfflineProgress() {
  try {
    return offlineProgressStore.data || [];
  } catch (error) {
    console.error('Failed to get offline progress:', error);
    return [];
  }
}

export async function saveOfflineProgress(progressData) {
  try {
    offlineProgressStore.data.push({
      ...progressData,
      timestamp: new Date().toISOString()
    });
    console.log('Progress saved to memory:', offlineProgressStore.data.length, 'items');
  } catch (error) {
    console.error('Failed to save offline progress:', error);
  }
}

export function getOfflineProgressStore() {
  return offlineProgressStore.data;
}

export function clearOfflineProgressStore() {
  offlineProgressStore.data = [];
}