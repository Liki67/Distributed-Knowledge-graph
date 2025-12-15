import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';
import { getKnowledgeGraph } from '@/lib/api';

export default function GraphVisualization({ onNodeSelect }) {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    loadGraphData();
  }, []);

  async function loadGraphData() {
    try {
      const data = await getKnowledgeGraph();
      setGraphData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load knowledge graph');
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!graphData.nodes.length || !svgRef.current) return;

    const width = svgRef.current.getBoundingClientRect().width;
    const height = 600;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup SVG with zoom support
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    const g = svg.append("g");

    // Add zoom behavior
    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      }));

    // Create forces for graph layout
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links)
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // Create links with directional arrows
    const links = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value || 1))
      .attr("marker-end", "url(#arrow)");

    // Add arrow markers
    svg.append("defs").selectAll("marker")
      .data(["arrow"])
      .join("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#999")
      .attr("d", "M0,-5L10,0L0,5");

    // Create nodes
    const nodes = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graphData.nodes)
      .join("g")
      .call(drag(simulation));

    // Add circles for nodes
    nodes.append("circle")
      .attr("r", d => {
        // Size based on connections and resources
        const baseSize = 15;
        const connectionBonus = d.links ? d.links.length : 0;
        const resourceBonus = d.resourceCount || 0;
        return baseSize + Math.sqrt(connectionBonus + resourceBonus) * 2;
      })
      .attr("fill", d => getNodeColor(d.type))
      .attr("stroke", d => d.id === selectedNode?.id ? "#fbbf24" : "#fff")
      .attr("stroke-width", d => d.id === selectedNode?.id ? 3 : 2);

    // Add labels
    nodes.append("text")
      .text(d => d.name)
      .attr("x", 0)
      .attr("y", d => {
        const baseSize = 15;
        const connectionBonus = d.links ? d.links.length : 0;
        const resourceBonus = d.resourceCount || 0;
        const radius = baseSize + Math.sqrt(connectionBonus + resourceBonus) * 2;
        return radius + 15;
      })
      .attr("text-anchor", "middle")
      .attr("fill", "#374151")
      .style("font-size", "12px")
      .style("font-weight", "500");

    // Add titles for hover
    nodes.append("title")
      .text(d => `${d.name}\nType: ${d.type}\nResources: ${d.resourceCount || 0}`);

    // Handle node click
    nodes.on("click", (event, d) => {
      setSelectedNode(d);
      if (onNodeSelect) {
        onNodeSelect(d);
      }
    });

    // Update positions on each tick
    simulation.on("tick", () => {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodes
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [graphData, onNodeSelect, selectedNode]);

  // Drag handler
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  // Get color based on node type
  function getNodeColor(type) {
    const colors = {
      topic: "#4f46e5", // Indigo for main educational topics
      concept: "#059669", // Emerald for concepts/subtopics
      resource: "#0ea5e9", // Sky blue for educational resources
      article: "#8b5cf6", // Purple for articles
      video: "#ec4899", // Pink for video content
      exercise: "#f59e0b", // Orange for practice exercises
      default: "#6b7280" // Gray for undefined types
    };
    return colors[type] || colors.default;
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[600px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[600px] text-red-600">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Knowledge Network</h3>
            <p className="text-sm text-gray-500">
              Interactive visualization of educational topics and their relationships
            </p>
          </div>
          {selectedNode && (
            <div className="text-sm text-gray-600">
              Selected: {selectedNode.name} ({selectedNode.type})
            </div>
          )}
        </div>
        <svg 
          ref={svgRef} 
          className="w-full h-[600px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg"
        />
        <div className="flex gap-4 justify-center text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4f46e5]" /> Topics
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#059669]" /> Concepts
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#0ea5e9]" /> Resources
          </div>
        </div>
      </div>
    </Card>
  );
}