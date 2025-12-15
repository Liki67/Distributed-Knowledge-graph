/**
 * Application Configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io';

export const API_ENDPOINTS = {
  // Knowledge Graph
  TOPICS: '/api/topics',
  TOPIC_BY_ID: (id) => `/api/topics/${id}`,
  TOPIC_RELATIONSHIPS: '/api/topics/relationships',
  
  // Learning Paths
  LEARNING_PATHS: '/api/paths',
  RECOMMENDED_PATHS: '/api/paths/recommended',
  PATH_BY_ID: (id) => `/api/paths/${id}`,
  
  // Resources
  RESOURCES: '/api/resources',
  RESOURCE_BY_ID: (id) => `/api/resources/${id}`,
  RESOURCE_BY_CID: (cid) => `/api/ipfs/resource/${cid}`,
  
  // Search
  SEARCH: '/api/search',
  AI_SEARCH: '/api/ai-search',
  
  // User Progress
  USER_PROGRESS: '/api/user/progress',
  UPDATE_PROGRESS: '/api/user/progress/update'
};