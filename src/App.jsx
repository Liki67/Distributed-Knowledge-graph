import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';

// Import all pages
import Dashboard from './pages/Dashboard';
import KnowledgeGraph from './pages/KnowledgeGraph';
import LearningPaths from './pages/LearningPaths';
import ContentLibrary from './pages/ContentLibrary';
import Search from './pages/Search';
import Home from './pages/Home';

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* The home page redirects to dashboard */}
        <Route path="/" element={<Home />} />
        
        {/* App routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
        <Route path="/learning-paths" element={<LearningPaths />} />
        <Route path="/content-library" element={<ContentLibrary />} />
        <Route path="/search" element={<Search />} />
        
        {/* Fallback to dashboard if no route matches */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
}