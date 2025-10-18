from neo4j import GraphDatabase
import json
import os
from dotenv import load_dotenv

load_dotenv()

def export_graph(uri="bolt://localhost:7687", user="neo4j", password="ShivaAb8@", database="neo4j"):
    driver = GraphDatabase.driver(uri, auth=(user, password))
    with driver.session(database=database) as session:
        # Export nodes
        nodes = session.run("MATCH (n:Entity) RETURN n.name AS name, n.type AS type, n.content AS content").data()
        # Export edges
        edges = session.run("MATCH (a:Entity)-[r]->(b:Entity) RETURN a.name AS source, b.name AS target, type(r) AS rel_type").data()
    
    # Save as JSON
    export_data = {"nodes": nodes, "edges": edges}
    with open("graph_export.json", "w") as f:
        json.dump(export_data, f, indent=2)
    print(f"Exported {len(nodes)} nodes and {len(edges)} edges to graph_export.json")
    driver.close()

# Run
export_graph()