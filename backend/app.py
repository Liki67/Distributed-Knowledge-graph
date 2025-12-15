import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from neo4j import GraphDatabase
import ipfshttpclient
from dotenv import load_dotenv

# --- INITIALIZATION ---
load_dotenv()

app = Flask(__name__)

# Enable CORS with specific origins for security
CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("CORS_ORIGINS", "").split(",")
])

# --- NEO4J CONNECTION ---
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
neo4j_driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# --- IPFS CONNECTION ---
IPFS_API_URL = os.getenv("IPFS_API_URL")
try:
    ipfs_client = ipfshttpclient.connect(IPFS_API_URL)
    print("✅ Connected to IPFS")
except Exception as e:
    print(f"⚠️  IPFS connection failed: {e}")
    ipfs_client = None

# --- HELPER FUNCTIONS ---
def serialize_node(node):
    """Converts a Neo4j Node object into a JSON-serializable dictionary."""
    node_dict = dict(node.items())
    # Add the internal ID for relationships
    node_dict['id'] = node.element_id 
    return node_dict

def serialize_relationship(rel):
    """Converts a Neo4j Relationship into a dict."""
    return {
        'source': rel.start_node.element_id,
        'target': rel.end_node.element_id,
        'type': rel.type,
        'properties': dict(rel.items())
    }

# --- GNN & AI MODEL PLACEHOLDERS ---
def run_gnn_recommendation(user_profile):
    """
    Placeholder for your GNN model.
    - Takes user data (e.g., interests, progress).
    - Queries Neo4j to get the current graph state.
    - Runs the GNN to determine the optimal learning path.
    - Returns a structured learning path object.
    """
    print(f"🤖 Running GNN recommendation for profile: {user_profile}")
    
    # TODO: Replace with actual PyTorch GNN model
    # Example flow:
    # 1. Get graph from Neo4j
    # 2. Convert to PyTorch Geometric format
    # 3. Run GNN inference
    # 4. Generate path recommendations
    
    # Mock response: In a real scenario, this would be the GNN's output
    return {
        "id": "ai-generated-path-123",
        "name": "AI-Generated Path for Beginners",
        "description": "A custom path created by the GNN based on your profile.",
        "category": "technology",
        "difficulty_level": "beginner",
        "estimated_duration_hours": 10,
        "target_audience": user_profile.get("audience", "General learners"),
        "sequence": [
            {
                "step": 1, 
                "topic_id": "some_topic_id_from_neo4j", 
                "description": "Start with the basics of AI."
            },
            {
                "step": 2, 
                "topic_id": "another_topic_id", 
                "description": "Move on to machine learning concepts."
            }
        ]
    }

def run_ai_search(query, context):
    """
    Placeholder for your AI-powered search logic.
    - This could use a GNN to find related nodes or an LLM for semantic search.
    """
    print(f"🔍 Running AI search for query: '{query}'")
    
    # TODO: Replace with actual AI search implementation
    # Options:
    # 1. Use embeddings + vector similarity
    # 2. Use LLM for semantic understanding
    # 3. Use GNN for graph-based recommendations
    
    # Mock response with structure matching frontend expectations
    return {
        "interpretation": f"Based on your query '{query}', here are personalized recommendations.",
        "recommended_topics": ["Machine Learning", "Neural Networks", "Data Science"],
        "suggested_resources": [
            "Introduction to Machine Learning",
            "Deep Learning Fundamentals",
            "Practical Neural Networks"
        ],
        "learning_path_suggestion": "Start with foundational ML concepts, then progress to neural networks",
        "related_searches": [
            "deep learning basics",
            "neural network architectures",
            "machine learning algorithms"
        ]
    }


# --- HEALTH CHECK ---
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify API is running."""
    neo4j_status = "connected"
    try:
        with neo4j_driver.session() as session:
            session.run("RETURN 1")
    except Exception as e:
        neo4j_status = f"disconnected: {str(e)}"
    
    ipfs_status = "connected" if ipfs_client else "disconnected"
    
    return jsonify({
        "status": "healthy",
        "service": "EduGraph API",
        "version": "1.0.0",
        "neo4j": neo4j_status,
        "ipfs": ipfs_status
    })


# --- TOPIC ENDPOINTS ---
@app.route('/api/topics', methods=['GET'])
def get_topics():
    """Get all Topic nodes from Neo4j."""
    try:
        query = """
            MATCH (t:Topic)
            OPTIONAL MATCH (t)-[:RELATED_TO]->(related:Topic)
            RETURN t, collect(DISTINCT related.id) as related_topics
            ORDER BY t.name
        """
        with neo4j_driver.session() as session:
            results = session.run(query).data()
            topics = []
            for record in results:
                topic = serialize_node(record['t'])
                topic['related_topics'] = record['related_topics']
                topics.append(topic)
            return jsonify(topics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/topics/<string:topic_id>', methods=['GET'])
def get_topic_by_id(topic_id):
    """Get a specific topic by ID."""
    try:
        query = """
            MATCH (t:Topic)
            WHERE t.id = $topic_id OR elementId(t) = $topic_id
            OPTIONAL MATCH (t)-[:RELATED_TO]->(related:Topic)
            OPTIONAL MATCH (t)-[:HAS_RESOURCE]->(r:Resource)
            RETURN t, 
                   collect(DISTINCT related.id) as related_topics,
                   collect(DISTINCT r.id) as resource_ids
        """
        with neo4j_driver.session() as session:
            result = session.run(query, topic_id=topic_id).single()
            if result:
                topic = serialize_node(result['t'])
                topic['related_topics'] = result['related_topics']
                topic['resource_ids'] = result['resource_ids']
                return jsonify(topic)
            return jsonify({"error": "Topic not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/topics/relationships', methods=['GET'])
def get_topic_relationships():
    """Get knowledge graph structure (nodes and links) for visualization."""
    try:
        # Get all nodes (Topics and Resources)
        nodes_query = """
            MATCH (n)
            WHERE n:Topic OR n:Resource
            RETURN elementId(n) as id, 
                   n.name as name, 
                   labels(n)[0] as type,
                   n.category as category,
                   n.difficulty_level as difficulty_level,
                   n.resource_type as resource_type,
                   size((n)--()) as connectionCount
        """
        
        # Get all relationships
        links_query = """
            MATCH (a)-[r]->(b)
            WHERE (a:Topic OR a:Resource) AND (b:Topic OR b:Resource)
            RETURN elementId(a) as source, 
                   elementId(b) as target, 
                   type(r) as relationship,
                   1 as value
        """
        
        with neo4j_driver.session() as session:
            nodes_result = session.run(nodes_query).data()
            links_result = session.run(links_query).data()
            
            # Format nodes
            nodes = []
            for record in nodes_result:
                node = {
                    'id': record['id'],
                    'name': record['name'],
                    'type': record['type'].lower(),
                    'category': record.get('category'),
                    'difficulty_level': record.get('difficulty_level'),
                    'resource_type': record.get('resource_type'),
                    'resourceCount': record.get('connectionCount', 0)
                }
                nodes.append(node)
            
            return jsonify({
                'nodes': nodes,
                'links': links_result
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- RESOURCE ENDPOINTS ---
@app.route('/api/resources', methods=['GET'])
def get_resources():
    """Get all Resource nodes from Neo4j."""
    try:
        query = """
            MATCH (r:Resource)
            OPTIONAL MATCH (t:Topic)-[:HAS_RESOURCE]->(r)
            RETURN r, collect(DISTINCT elementId(t)) as topic_ids
            ORDER BY r.title
        """
        with neo4j_driver.session() as session:
            results = session.run(query).data()
            resources = []
            for record in results:
                resource = serialize_node(record['r'])
                resource['topic_ids'] = record['topic_ids']
                resources.append(resource)
            return jsonify(resources)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/resources/<string:resource_id>', methods=['GET'])
def get_resource_by_id(resource_id):
    """Get a specific resource by ID."""
    try:
        query = """
            MATCH (r:Resource)
            WHERE r.id = $resource_id OR elementId(r) = $resource_id
            OPTIONAL MATCH (t:Topic)-[:HAS_RESOURCE]->(r)
            RETURN r, collect(DISTINCT elementId(t)) as topic_ids
        """
        with neo4j_driver.session() as session:
            result = session.run(query, resource_id=resource_id).single()
            if result:
                resource = serialize_node(result['r'])
                resource['topic_ids'] = result['topic_ids']
                return jsonify(resource)
            return jsonify({"error": "Resource not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- IPFS ENDPOINTS ---
@app.route('/api/ipfs/resource/<string:cid>', methods=['GET'])
def get_ipfs_resource(cid):
    """Fetch content from IPFS using its CID."""
    if not ipfs_client:
        return jsonify({"error": "IPFS client not connected"}), 503
    
    try:
        content_bytes = ipfs_client.cat(cid)
        content = content_bytes.decode('utf-8')
        return jsonify({"cid": cid, "content": content})
    except ipfshttpclient.exceptions.StatusError as e:
        return jsonify({"error": f"CID not found or IPFS daemon error: {e}"}), 404
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500


# --- LEARNING PATH ENDPOINTS ---
@app.route('/api/paths', methods=['GET'])
def get_paths():
    """Get all LearningPath nodes from Neo4j."""
    try:
        query = """
            MATCH (p:LearningPath)
            OPTIONAL MATCH (p)-[inc:INCLUDES]->(t:Topic)
            WITH p, collect({
                step: inc.step, 
                topic_id: elementId(t), 
                description: inc.description
            }) as sequence
            RETURN p, sequence
            ORDER BY p.name
        """
        with neo4j_driver.session() as session:
            results = session.run(query).data()
            paths = []
            for record in results:
                path = serialize_node(record['p'])
                # Sort sequence by step number
                path['sequence'] = sorted(
                    [s for s in record['sequence'] if s['topic_id']], 
                    key=lambda x: x.get('step', 0)
                )
                paths.append(path)
            return jsonify(paths)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/paths/<string:path_id>', methods=['GET'])
def get_path_by_id(path_id):
    """Get a specific learning path by ID."""
    try:
        query = """
            MATCH (p:LearningPath)
            WHERE p.id = $path_id OR elementId(p) = $path_id
            OPTIONAL MATCH (p)-[inc:INCLUDES]->(t:Topic)
            WITH p, collect({
                step: inc.step, 
                topic_id: elementId(t), 
                description: inc.description
            }) as sequence
            RETURN p, sequence
        """
        with neo4j_driver.session() as session:
            result = session.run(query, path_id=path_id).single()
            if result:
                path = serialize_node(result['p'])
                path['sequence'] = sorted(
                    [s for s in result['sequence'] if s['topic_id']], 
                    key=lambda x: x.get('step', 0)
                )
                return jsonify(path)
            return jsonify({"error": "Path not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/paths/recommended', methods=['POST'])
def recommend_path():
    """Trigger GNN-based learning path recommendation."""
    try:
        data = request.get_json()
        user_profile = data.get('profile')
        if not user_profile:
            return jsonify({"error": "User profile data is required"}), 400
        
        # Call your GNN model function
        recommended_path = run_gnn_recommendation(user_profile)
        
        # TODO: Optionally save the generated path to Neo4j
        # query = """
        #     CREATE (p:LearningPath {
        #         id: $id,
        #         name: $name,
        #         description: $description,
        #         ...
        #     })
        #     RETURN p
        # """
        
        return jsonify(recommended_path)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- SEARCH ENDPOINTS ---
@app.route('/api/search', methods=['POST'])
def search():
    """Basic search across topics and resources."""
    try:
        data = request.get_json()
        query = data.get('query', '').lower()
        
        if not query:
            return jsonify({"error": "Search query is required"}), 400
        
        search_query = """
            MATCH (n)
            WHERE (n:Topic OR n:Resource)
              AND (toLower(n.name) CONTAINS $query 
                   OR toLower(coalesce(n.description, '')) CONTAINS $query
                   OR toLower(coalesce(n.title, '')) CONTAINS $query)
            RETURN n, labels(n)[0] as type
            LIMIT 50
        """
        
        with neo4j_driver.session() as session:
            results = session.run(search_query, query=query).data()
            search_results = []
            for record in results:
                result = serialize_node(record['n'])
                result['type'] = record['type']
                search_results.append(result)
            
            return jsonify(search_results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai-search', methods=['POST'])
def ai_search():
    """Advanced AI-powered search."""
    try:
        data = request.get_json()
        query = data.get('query')
        context = data.get('context', {})
        
        if not query:
            return jsonify({"error": "Search query is required"}), 400
        
        search_results = run_ai_search(query, context)
        return jsonify(search_results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- USER PROGRESS ENDPOINTS ---
@app.route('/api/user/progress', methods=['GET'])
def get_user_progress():
    """Get user's learning progress."""
    try:
        # TODO: Implement user authentication and get real user_id
        user_id = request.args.get('user_id', 'demo_user')
        
        # TODO: Query progress from database
        # For now, return empty array
        return jsonify([])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user/progress/update', methods=['POST'])
def update_user_progress():
    """Update user's learning progress."""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'demo_user')
        updates = data.get('updates', [])
        
        # TODO: Save progress to database
        print(f"💾 Saving progress for user {user_id}: {len(updates)} updates")
        
        return jsonify({
            "success": True,
            "synced": len(updates)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- ERROR HANDLERS ---
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


# --- RUN THE APP ---
if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5000))
    host = os.getenv('API_HOST', '127.0.0.1')
    
    print("=" * 50)
    print("🚀 EduGraph API Server Starting...")
    print(f"📡 Server: http://{host}:{port}")
    print(f"🏥 Health: http://{host}:{port}/health")
    print(f"🔗 Neo4j: {NEO4J_URI}")
    print(f"📦 IPFS: {'Connected' if ipfs_client else 'Disconnected'}")
    print("=" * 50)
    
    app.run(debug=True, host=host, port=port)