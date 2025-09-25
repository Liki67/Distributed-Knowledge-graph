from neo4j import GraphDatabase
import json
import logging
from datetime import datetime
import os
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    filename="graph_builder.log",
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class KnowledgeGraphBuilder:
    def __init__(self, uri, user, password, database="neo4j"):
        """Initialize Neo4j driver with database."""
        try:
            self.driver = GraphDatabase.driver(uri, auth=(user, password))
            self.database = database
            logger.info(f"Connected to Neo4j database: {database}")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            raise

    def close(self):
        """Close Neo4j driver."""
        self.driver.close()
        logger.info("Neo4j connection closed")

    def create_index(self):
        """Create index on Entity name for fast lookups."""
        with self.driver.session(database="system") as session:  # Admin tasks on system DB
            try:
                session.run("CREATE INDEX IF NOT EXISTS FOR (n:Entity) ON (n.name)")
                logger.info("Created index on Entity.name")
            except Exception as e:
                logger.error(f"Error creating index: {e}")

    def batch_insert(self, data, batch_size=1000):
        """Insert nodes and relationships in batches using Cypher MERGE (no APOC)."""
        with self.driver.session(database=self.database) as session:
            for i in range(0, len(data), batch_size):
                batch = data[i:i + batch_size]
                tx = None
                try:
                    tx = session.begin_transaction()
                    for item in batch:
                        # Insert entities as nodes
                        for entity in item["entities"]:
                            tx.run(
                                """
                                MERGE (n:Entity {name: $name})
                                SET n.type = $type,
                                    n.source = $source,
                                    n.url = $url,
                                    n.title = $title,
                                    n.content = $content
                                """,
                                name=entity["text"],
                                type=entity["type"],
                                source=item["source"],
                                url=item["url"],
                                title=item["title"],
                                content=item["content"][:1000]
                            )

                        # Insert relationships (dynamic type without APOC)
                        for rel in item["relationships"]:
                            query = f"""
                            MATCH (a:Entity {{name: $source}}), (b:Entity {{name: $target}})
                            MERGE (a)-[r:`{rel['type']}`]->(b)
                            """
                            tx.run(query, source=rel["source_entity"], target=rel["target_entity"])

                    tx.commit()
                    logger.info(f"Inserted batch {i//batch_size + 1} with {len(batch)} items")
                except Exception as e:
                    if tx is not None:
                        tx.rollback()
                    logger.error(f"Error in batch {i//batch_size + 1}: {e}")
                    raise

    def verify_graph(self):
        """Run sample queries to verify graph structure."""
        with self.driver.session(database=self.database) as session:
            try:
                node_count = session.run("MATCH (n:Entity) RETURN count(n) AS count").single()["count"]
                logger.info(f"Graph contains {node_count} nodes")

                rel_count = session.run("MATCH ()-[r]->() RETURN count(r) AS count").single()["count"]
                logger.info(f"Graph contains {rel_count} relationships")

                paths = session.run(
                    "MATCH p=(n:Entity {name: 'Geography'})-[*1..3]->(m) RETURN p LIMIT 5"
                ).data()
                logger.info(f"Sample paths from 'Geography': {len(paths)} found")
            except Exception as e:
                logger.error(f"Error verifying graph: {e}")

def build_graph(json_file="data.json", uri="bolt://localhost:7687", user="neo4j", password="tryingtrying", database="neo4j"):
    """Main function to build knowledge graph from JSON."""
    try:
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        logger.info(f"Loaded {len(data)} items from {json_file}")

        builder = KnowledgeGraphBuilder(uri, user, password, database=database)

        builder.create_index()
        builder.batch_insert(data, batch_size=1000)
        builder.verify_graph()
        builder.close()

    except Exception as e:
        logger.error(f"Failed to build graph: {e}")
        raise

# Example usage
if __name__ == "__main__":
    neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password = os.getenv("NEO4J_PASSWORD", "tryingtrying")
    build_graph(json_file="data.json", uri=neo4j_uri, user=neo4j_user, password=neo4j_password, database="neo4j")