"""
Neo4j Database Seeding Script
Run this to populate your Neo4j database with sample educational data
"""

import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def clear_database():
    """Clear all nodes and relationships (use with caution!)"""
    with driver.session() as session:
        session.run("MATCH (n) DETACH DELETE n")
        print("🗑️  Database cleared")

def create_topics():
    """Create sample educational topics"""
    topics = [
        {
            "id": "topic-1",
            "name": "Sustainable Farming Basics",
            "description": "Learn fundamental sustainable agricultural practices for small-scale farmers",
            "category": "agriculture",
            "difficulty_level": "beginner",
            "keywords": ["farming", "sustainability", "agriculture", "basics"]
        },
        {
            "id": "topic-2",
            "name": "Water Conservation Techniques",
            "description": "Efficient water usage and management strategies for agriculture",
            "category": "agriculture",
            "difficulty_level": "intermediate",
            "keywords": ["water", "conservation", "irrigation", "efficiency"]
        },
        {
            "id": "topic-3",
            "name": "Crop Rotation Methods",
            "description": "Understanding and implementing crop rotation for soil health",
            "category": "agriculture",
            "difficulty_level": "beginner",
            "keywords": ["crops", "rotation", "soil", "health"]
        },
        {
            "id": "topic-4",
            "name": "Organic Pest Control",
            "description": "Natural methods for managing pests without harmful chemicals",
            "category": "agriculture",
            "difficulty_level": "intermediate",
            "keywords": ["organic", "pests", "natural", "control"]
        },
        {
            "id": "topic-5",
            "name": "Basic Financial Literacy",
            "description": "Essential money management skills for everyday life",
            "category": "practical_skills",
            "difficulty_level": "beginner",
            "keywords": ["money", "budgeting", "savings", "finance"]
        },
        {
            "id": "topic-6",
            "name": "Solar Energy Basics",
            "description": "Introduction to solar power and its applications",
            "category": "technology",
            "difficulty_level": "beginner",
            "keywords": ["solar", "energy", "renewable", "power"]
        },
        {
            "id": "topic-7",
            "name": "Water Pump Maintenance",
            "description": "How to maintain and repair common water pumps",
            "category": "practical_skills",
            "difficulty_level": "intermediate",
            "keywords": ["pump", "water", "maintenance", "repair"]
        },
        {
            "id": "topic-8",
            "name": "English Communication Skills",
            "description": "Basic English conversation for everyday situations",
            "category": "language",
            "difficulty_level": "beginner",
            "keywords": ["english", "communication", "language", "speaking"]
        }
    ]
    
    with driver.session() as session:
        for topic in topics:
            query = """
                CREATE (t:Topic {
                    id: $id,
                    name: $name,
                    description: $description,
                    category: $category,
                    difficulty_level: $difficulty_level,
                    keywords: $keywords
                })
            """
            session.run(query, **topic)
        print(f"✅ Created {len(topics)} topics")

def create_relationships():
    """Create relationships between topics"""
    relationships = [
        ("topic-1", "topic-2", "Water management is part of sustainable farming"),
        ("topic-1", "topic-3", "Crop rotation is a sustainable farming practice"),
        ("topic-1", "topic-4", "Organic pest control supports sustainability"),
        ("topic-2", "topic-7", "Water pumps are used for irrigation"),
        ("topic-6", "topic-7", "Solar pumps combine solar energy with water management"),
    ]
    
    with driver.session() as session:
        for source_id, target_id, description in relationships:
            query = """
                MATCH (s:Topic {id: $source_id}), (t:Topic {id: $target_id})
                CREATE (s)-[:RELATED_TO {description: $description}]->(t)
            """
            session.run(query, source_id=source_id, target_id=target_id, description=description)
        print(f"✅ Created {len(relationships)} topic relationships")

def create_resources():
    """Create sample learning resources"""
    resources = [
        {
            "id": "resource-1",
            "title": "Introduction to Sustainable Farming",
            "content": "Sustainable farming focuses on producing food while preserving the environment. Key principles include soil health, water conservation, and biodiversity. Small-scale farmers can start by implementing crop rotation, using organic fertilizers, and minimizing tillage.",
            "resource_type": "article",
            "difficulty_level": "beginner",
            "estimated_time_minutes": 15,
            "offline_available": True,
            "tags": ["farming", "beginner", "guide", "sustainable"],
            "topic_id": "topic-1"
        },
        {
            "id": "resource-2",
            "title": "Water-Saving Irrigation Techniques",
            "content": "Drip irrigation and mulching can reduce water usage by up to 50%. Learn how to implement these cost-effective methods on your farm.",
            "resource_type": "video_link",
            "difficulty_level": "intermediate",
            "estimated_time_minutes": 20,
            "offline_available": False,
            "tags": ["water", "irrigation", "conservation"],
            "source_url": "https://example.com/water-saving-video",
            "topic_id": "topic-2"
        },
        {
            "id": "resource-3",
            "title": "Crop Rotation Planning Guide",
            "content": "A step-by-step guide to planning crop rotation for small farms. Includes seasonal calendars and crop family groupings.",
            "resource_type": "tutorial",
            "difficulty_level": "beginner",
            "estimated_time_minutes": 30,
            "offline_available": True,
            "tags": ["crops", "planning", "rotation", "guide"],
            "topic_id": "topic-3"
        },
        {
            "id": "resource-4",
            "title": "Natural Pest Control Methods",
            "content": "Discover organic alternatives to chemical pesticides. Learn about companion planting, beneficial insects, and homemade pest deterrents.",
            "resource_type": "article",
            "difficulty_level": "intermediate",
            "estimated_time_minutes": 25,
            "offline_available": True,
            "tags": ["organic", "pests", "natural"],
            "topic_id": "topic-4"
        },
        {
            "id": "resource-5",
            "title": "Budgeting Basics",
            "content": "Learn how to track income and expenses, create a simple budget, and start saving for the future.",
            "resource_type": "tutorial",
            "difficulty_level": "beginner",
            "estimated_time_minutes": 20,
            "offline_available": True,
            "tags": ["money", "budgeting", "savings"],
            "topic_id": "topic-5"
        },
        {
            "id": "resource-6",
            "title": "Solar Panel Basics",
            "content": "Understanding how solar panels work, their benefits, and basic installation considerations for rural areas.",
            "resource_type": "article",
            "difficulty_level": "beginner",
            "estimated_time_minutes": 15,
            "offline_available": True,
            "tags": ["solar", "energy", "renewable"],
            "topic_id": "topic-6"
        }
    ]
    
    with driver.session() as session:
        for resource in resources:
            topic_id = resource.pop('topic_id')
            
            # Create resource
            query = """
                CREATE (r:Resource {
                    id: $id,
                    title: $title,
                    content: $content,
                    resource_type: $resource_type,
                    difficulty_level: $difficulty_level,
                    estimated_time_minutes: $estimated_time_minutes,
                    offline_available: $offline_available,
                    tags: $tags
                })
            """
            session.run(query, **resource)
            
            # Link to topic
            link_query = """
                MATCH (t:Topic {id: $topic_id}), (r:Resource {id: $resource_id})
                CREATE (t)-[:HAS_RESOURCE]->(r)
            """
            session.run(link_query, topic_id=topic_id, resource_id=resource['id'])
        
        print(f"✅ Created {len(resources)} resources")

def create_learning_paths():
    """Create sample learning paths"""
    paths = [
        {
            "id": "path-1",
            "name": "New Farmer Starter Guide",
            "description": "Complete learning path for aspiring farmers with no prior experience",
            "category": "agriculture",
            "difficulty_level": "beginner",
            "target_audience": "New farmers in rural areas",
            "estimated_duration_hours": 40,
            "sequence": [
                ("topic-1", 1, "Start with sustainable farming basics"),
                ("topic-3", 2, "Learn about crop rotation"),
                ("topic-2", 3, "Understand water conservation"),
                ("topic-4", 4, "Master organic pest control")
            ]
        },
        {
            "id": "path-2",
            "name": "Essential Life Skills",
            "description": "Practical skills for everyday life and self-sufficiency",
            "category": "practical_skills",
            "difficulty_level": "beginner",
            "target_audience": "Adults seeking practical knowledge",
            "estimated_duration_hours": 20,
            "sequence": [
                ("topic-5", 1, "Start with financial literacy"),
                ("topic-8", 2, "Learn basic English communication"),
                ("topic-7", 3, "Understand basic maintenance skills")
            ]
        },
        {
            "id": "path-3",
            "name": "Sustainable Technology Basics",
            "description": "Introduction to renewable energy and appropriate technology",
            "category": "technology",
            "difficulty_level": "beginner",
            "target_audience": "Rural communities interested in sustainable tech",
            "estimated_duration_hours": 15,
            "sequence": [
                ("topic-6", 1, "Learn about solar energy"),
                ("topic-7", 2, "Understand water pump systems"),
                ("topic-2", 3, "Apply knowledge to water management")
            ]
        }
    ]
    
    with driver.session() as session:
        for path in paths:
            sequence = path.pop('sequence')
            
            # Create path
            query = """
                CREATE (p:LearningPath {
                    id: $id,
                    name: $name,
                    description: $description,
                    category: $category,
                    difficulty_level: $difficulty_level,
                    target_audience: $target_audience,
                    estimated_duration_hours: $estimated_duration_hours
                })
            """
            session.run(query, **path)
            
            # Link topics in sequence
            for topic_id, step, description in sequence:
                link_query = """
                    MATCH (p:LearningPath {id: $path_id}), (t:Topic {id: $topic_id})
                    CREATE (p)-[:INCLUDES {step: $step, description: $description}]->(t)
                """
                session.run(link_query, path_id=path['id'], topic_id=topic_id, step=step, description=description)
        
        print(f"✅ Created {len(paths)} learning paths")

def verify_data():
    """Verify the seeded data"""
    with driver.session() as session:
        # Count nodes
        counts = {
            'topics': session.run("MATCH (t:Topic) RETURN count(t) as count").single()['count'],
            'resources': session.run("MATCH (r:Resource) RETURN count(r) as count").single()['count'],
            'paths': session.run("MATCH (p:LearningPath) RETURN count(p) as count").single()['count'],
            'relationships': session.run("MATCH ()-[r]->() RETURN count(r) as count").single()['count']
        }
        
        print("\n📊 Database Summary:")
        print(f"   Topics: {counts['topics']}")
        print(f"   Resources: {counts['resources']}")
        print(f"   Learning Paths: {counts['paths']}")
        print(f"   Total Relationships: {counts['relationships']}")

def main():
    """Main seeding function"""
    print("🌱 Starting database seeding...\n")
    
    # Ask for confirmation before clearing
    response = input("⚠️  This will clear ALL existing data. Continue? (yes/no): ")
    if response.lower() != 'yes':
        print("❌ Seeding cancelled")
        return
    
    try:
        clear_database()
        create_topics()
        create_relationships()
        create_resources()
        create_learning_paths()
        verify_data()
        
        print("\n✅ Database seeding completed successfully!")
        print("🚀 You can now start your Flask server and React app")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
    finally:
        driver.close()

if __name__ == "__main__":
    main()