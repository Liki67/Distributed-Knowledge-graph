from bs4 import BeautifulSoup
import requests
import tweepy
import spacy
import PyPDF2
import uuid
import json
from datetime import datetime
import os
from dotenv import load_dotenv
import logging
import re
from tenacity import retry, stop_after_attempt, wait_exponential

# Set up logging
logging.basicConfig(level=logging.INFO, filename="scraper.log", format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load spaCy model and environment variables
nlp = spacy.load("en_core_web_sm")
load_dotenv()

# JSON schema for knowledge graph
def format_data(id, source, url, title, content, entities, relationships, metadata):
    return {
        "id": id,
        "source": source,
        "url": url,
        "title": title,
        "content": content,
        "entities": entities,
        "relationships": relationships,
        "metadata": metadata
    }

# Clean text (remove noise, normalize)
def clean_text(text):
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    text = re.sub(r'\[.*?\]', '', text)  # Remove Wikipedia citations
    text = text[:5000]                        # Limit length for efficiency

    # Step 2: Summarization (extractive)
    doc = nlp(text)
    sentences = list(doc.sents)

    # Rank sentences by length and noun density (simple heuristic)
    ranked = sorted(sentences, key=lambda s: (len(s), sum(1 for token in s if token.pos_ == "NOUN")), reverse=True)

    # Select top 3 sentences as summary
    summary = ' '.join(str(sent) for sent in ranked[:5])
    return summary

# Extract entities and relationships
def extract_entities_and_relationships(text):
    try:
        doc = nlp(text)
        entities = [
            {"text": ent.text, "type": ent.label_, "start_pos": ent.start_char, "end_pos": ent.end_char}
            for ent in doc.ents if ent.label_ in ["GPE", "LOC", "ORG", "PERSON", "NORP"]
        ]
        relationships = []
        for i, ent1 in enumerate(entities):
            for ent2 in entities[i+1:i+3]:  # Look at nearby entities
                if ent1["type"] in ["GPE", "LOC", "ORG"] and ent2["type"] in ["GPE", "LOC", "ORG"]:
                    relationships.append({
                        "source_entity": ent1["text"],
                        "target_entity": ent2["text"],
                        "type": "RELATED_TO"
                    })
        return entities, relationships
    except Exception as e:
        logger.error(f"Error in entity extraction: {e}")
        return [], []

# Wikipedia scraper
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def scrape_wikipedia(url):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        title = soup.find("h1").get_text(strip=True)
        content = " ".join([p.get_text(strip=True) for p in soup.find_all("p") if p.get_text(strip=True)])
        content = clean_text(content)
        entities, relationships = extract_entities_and_relationships(content)
        return format_data(
            id=str(uuid.uuid4()),
            source="wikipedia",
            url=url,
            title=title,
            content=content,
            entities=entities,
            relationships=relationships,
            metadata={"timestamp": datetime.utcnow().isoformat() + "Z", "author": None, "tags": ["education", title.lower()]}
        )
    except Exception as e:
        logger.error(f"Error scraping Wikipedia {url}: {e}")
        return None

# X scraper
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def scrape_x(query, max_results=100):
    client = tweepy.Client(bearer_token=os.getenv("X_BEARER_TOKEN"))
    try:
        tweets = client.search_recent_tweets(query=query, max_results=max_results, tweet_fields=["created_at", "author_id"])
        data = []
        seen_tweets = set()
        for tweet in tweets.data:
            content = clean_text(tweet.text)
            if content in seen_tweets:
                continue
            seen_tweets.add(content)
            entities, relationships = extract_entities_and_relationships(content)
            data.append(format_data(
                id=str(uuid.uuid4()),
                source="x",
                url=f"https://x.com/status/{tweet.id}",
                title=None,
                content=content,
                entities=entities,
                relationships=relationships,
                metadata={"timestamp": tweet.created_at.isoformat() + "Z", "author": f"user{tweet.author_id}", "tags": [query.replace("#", "")]}
            ))
        return data
    except Exception as e:
        logger.error(f"Error scraping X for {query}: {e}")
        return []

# Lecture notes scraper (PDF)
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def scrape_lecture_notes(pdf_url):
    try:
        response = requests.get(pdf_url)
        response.raise_for_status()
        with open("temp.pdf", "wb") as f:
            f.write(response.content)
        with open("temp.pdf", "rb") as file:
            reader = PyPDF2.PdfReader(file)
            content = " ".join([page.extract_text() or "" for page in reader.pages])
        content = clean_text(content)
        entities, relationships = extract_entities_and_relationships(content)
        return format_data(
            id=str(uuid.uuid4()),
            source="lecture_notes",
            url=pdf_url,
            title="Lecture Notes",
            content=content,
            entities=entities,
            relationships=relationships,
            metadata={"timestamp": datetime.utcnow().isoformat() + "Z", "author": None, "tags": ["education"]}
        )
    except Exception as e:
        logger.error(f"Error scraping lecture notes {pdf_url}: {e}")
        return None
    finally:
        if os.path.exists("temp.pdf"):
            os.remove("temp.pdf")

# Main scraping function
def collect_data(wiki_urls, x_queries, pdf_urls):
    data = []
    # Scrape Wikipedia
    for url in wiki_urls:
        wiki_data = scrape_wikipedia(url)
        if wiki_data:
            data.append(wiki_data)
            logger.info(f"Scraped Wikipedia: {url}")
    # Scrape X
    for query in x_queries:
        x_data = scrape_x(query, max_results=100)
        data.extend(x_data)
        logger.info(f"Scraped X for query: {query}, {len(x_data)} items")
    # Scrape lecture notes
    for pdf_url in pdf_urls:
        pdf_data = scrape_lecture_notes(pdf_url)
        if pdf_data:
            data.append(pdf_data)
            logger.info(f"Scraped lecture notes: {pdf_url}")
    # Save to JSON
    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    logger.info(f"Saved {len(data)} items to data.json")
    return data

# Example usage
wiki_urls = [
    "https://en.wikipedia.org/wiki/Geography",
    "https://en.wikipedia.org/wiki/Artificial_intelligence",
    "https://en.wikipedia.org/wiki/Mathematics",
    "https://en.wikipedia.org/wiki/History",
    "https://en.wikipedia.org/wiki/Social_science",
    "https://en.wikipedia.org/wiki/Political_science",
    "https://en.wikipedia.org/wiki/Machine_learning",
    "https://en.wikipedia.org/wiki/Deep_learning",
    "https://en.wikipedia.org/wiki/Statistics",
    "https://en.wikipedia.org/wiki/Computer_science",
    "https://en.wikipedia.org/wiki/Physics",
    "https://en.wikipedia.org/wiki/Chemistry",
    "https://en.wikipedia.org/wiki/Biology",
    "https://en.wikipedia.org/wiki/Economics",
    "https://en.wikipedia.org/wiki/Psychology",
    "https://en.wikipedia.org/wiki/Sociology",
    "https://en.wikipedia.org/wiki/Philosophy",
    "https://en.wikipedia.org/wiki/Anthropology",
    "https://en.wikipedia.org/wiki/Environmental_science",
    "https://en.wikipedia.org/wiki/Education"
    "https://en.wikipedia.org/wiki/English_language",
    "https://en.wikipedia.org/wiki/English_literature",
    "https://en.wikipedia.org/wiki/World_history",
    "https://en.wikipedia.org/wiki/World_geography",
    "https://en.wikipedia.org/wiki/Global_economics",
    "https://en.wikipedia.org/wiki/Global_politics",
    "https://en.wikipedia.org/wiki/Global_culture",
    "https://en.wikipedia.org/wiki/Global_environment",
    "https://en.wikipedia.org/wiki/Global_technology",
    "https://en.wikipedia.org/wiki/Global_health",
    "https://en.wikipedia.org/wiki/Global_education",
    "https://en.wikipedia.org/wiki/Data_science",
    "https://en.wikipedia.org/wiki/Information_technology",
    "https://en.wikipedia.org/wiki/Software_engineering",
    "https://en.wikipedia.org/wiki/Network_security",
    "https://en.wikipedia.org/wiki/Artificial_neural_network",
    "https://en.wikipedia.org/wiki/Computer_vision",
    "https://en.wikipedia.org/wiki/Natural_language_processing",
    "https://en.wikipedia.org/wiki/Robotics",
    "https://en.wikipedia.org/wiki/Cybersecurity",
    "https://en.wikipedia.org/wiki/Cloud_computing",
    "https://en.wikipedia.org/wiki/Big_data",
    "https://en.wikipedia.org/wiki/Internet_of_things",
    "https://en.wikipedia.org/wiki/Blockchain",
    "https://en.wikipedia.org/wiki/Quantum_computing",
    "https://en.wikipedia.org/wiki/Virtual_reality",
    "https://en.wikipedia.org/wiki/Augmented_reality",
    "https://en.wikipedia.org/wiki/Mixed_reality",
    "https://en.wikipedia.org/wiki/Edge_computing",
    "https://en.wikipedia.org/wiki/5G",
    "https://en.wikipedia.org/wiki/6G",
    "https://en.wikipedia.org/wiki/Smart_cities",
    "https://en.wikipedia.org/wiki/Sustainable_development",
    "https://en.wikipedia.org/wiki/Climate_change",
    "https://en.wikipedia.org/wiki/Renewable_energy",
    "https://en.wikipedia.org/wiki/Electric_vehicles",
    "https://en.wikipedia.org/wiki/Space_exploration",
    "https://en.wikipedia.org/wiki/Astronomy",
    "https://en.wikipedia.org/wiki/Astrophysics",
    "https://en.wikipedia.org/wiki/Geology",
    "https://en.wikipedia.org/wiki/Oceanography",
    "https://en.wikipedia.org/wiki/Meteorology",
    "https://en.wikipedia.org/wiki/Environmental_engineering",
    "https://en.wikipedia.org/wiki/Biotechnology",
    "https://en.wikipedia.org/wiki/Genetics",
    "https://en.wikipedia.org/wiki/Microbiology",
    "https://en.wikipedia.org/wiki/Neuroscience",
    "https://en.wikipedia.org/wiki/Immunology",
    "https://en.wikipedia.org/wiki/Pharmacology",
    "https://en.wikipedia.org/wiki/Medicine",
    "https://en.wikipedia.org/wiki/Nursing",
    "https://en.wikipedia.org/wiki/Public_health",
    "https://en.wikipedia.org/wiki/Epidemiology",
    "https://en.wikipedia.org/wiki/Health_education",
    "https://en.wikipedia.org/wiki/Nutrition",
    "https://en.wikipedia.org/wiki/Fitness",
    "https://en.wikipedia.org/wiki/Mental_health",
    "https://en.wikipedia.org/wiki/Mathematics",
    "https://en.wikipedia.org/wiki/Geometry",
    "https://en.wikipedia.org/wiki/Algebra",
    "https://en.wikipedia.org/wiki/Calculus",
    "https://en.wikipedia.org/wiki/Statistics",
    "https://en.wikipedia.org/wiki/Probability",
    "https://en.wikipedia.org/wiki/Number_theory",
    "https://en.wikipedia.org/wiki/Linear_algebra",
    "https://en.wikipedia.org/wiki/Discrete_mathematics",
    "https://en.wikipedia.org/wiki/Topology",
    "https://en.wikipedia.org/wiki/Mathematical_analysis",
    "https://en.wikipedia.org/wiki/Mathematical_logic",
    "https://en.wikipedia.org/wiki/Set_theory",
    "https://en.wikipedia.org/wiki/Combinatorics",
    "https://en.wikipedia.org/wiki/Graph_theory",
    "https://en.wikipedia.org/wiki/Mathematical_modeling",
    "https://en.wikipedia.org/wiki/Operations_research",
    "https://en.wikipedia.org/wiki/Optimization",
    "https://en.wikipedia.org/wiki/Mathematical_physics",
    "https://en.wikipedia.org/wiki/Computational_mathematics",
    "https://en.wikipedia.org/wiki/Applied_mathematics",
    "https://en.wikipedia.org/wiki/Theoretical_computer_science",
    "https://en.wikipedia.org/wiki/Algorithms",
    "https://en.wikipedia.org/wiki/Data_structures",
    "https://en.wikipedia.org/wiki/Computer_architecture",
    "https://en.wikipedia.org/wiki/Programming_languages",
    "https://en.wikipedia.org/wiki/Software_development",
    "https://en.wikipedia.org/wiki/Database_systems",
    "https://en.wikipedia.org/wiki/Computer_networks",
    "https://en.wikipedia.org/wiki/Grammer"
    "https://en.wikipedia.org/wiki/Vocabulary",
    "https://en.wikipedia.org/wiki/Reading_comprehension",
    "https://en.wikipedia.org/wiki/Writing_skills",
    "https://en.wikipedia.org/wiki/Literary_analysis",
    "https://en.wikipedia.org/wiki/Poetry",
    "https://en.wikipedia.org/wiki/Drama",
    "https://en.wikipedia.org/wiki/Novels",
    "https://en.wikipedia.org/wiki/Short_stories",
    "https://en.wikipedia.org/wiki/World_history",
    "https://en.wikipedia.org/wiki/Ancient_history",
    "https://en.wikipedia.org/wiki/Medieval_history",
    "https://en.wikipedia.org/wiki/Modern_history",
    "https://en.wikipedia.org/wiki/Contemporary_history",
    "https://en.wikipedia.org/wiki/History_of_science",
    "https://en.wikipedia.org/wiki/History_of_technology",
    "https://en.wikipedia.org/wiki/History_of_art",
    "https://en.wikipedia.org/wiki/History_of_culture",
    "https://en.wikipedia.org/wiki/World_geography",
    "https://en.wikipedia.org/wiki/Kannada",
    "https://en.wikipedia.org/wiki/Hindi",
    "https://en.wikipedia.org/wiki/Spanish_language",
    "https://en.wikipedia.org/wiki/French_language",
    "https://en.wikipedia.org/wiki/Chinese_language",
    "https://en.wikipedia.org/wiki/Arabic_language",
    "https://en.wikipedia.org/wiki/Russian_language",
    "https://en.wikipedia.org/wiki/Portuguese_language",
    "https://en.wikipedia.org/wiki/Biology_education",
    "https://en.wikipedia.org/wiki/Chemistry_education",
]
x_queries = ["#AIeducation", "#Geographyeducation", "#Matheducation","#Historyeducation", 
             "#Socioeducation", "#Poliscieducation", "#MachineLearningEducation", 
             "#DeepLearningEducation", "#StatEducation", "#CompSciEducation", "#PhysicsEducation", 
             "#ChemistryEducation", "#BioEducation", "#EconEducation", "#PsychEducation", 
             "#SociologyEducation", "#PhilosophyEducation", "#AnthropologyEducation", 
             "#EnvSciEducation", "#EdTech", "#DataScience", "#InfoTech", "#SoftwareEng", 
             "#NetSec", "#NeuralNetworks", "#CompVision", "#NLP", "#Robotics", "#CyberSec", 
             "#CloudComputing", "#BigData", "#IoT", "#Blockchain", "#QuantumComputing", 
             "#VirtualReality", "#AugmentedReality", "#MixedReality", "#EdgeComputing",
             "#5G", "#6G", "#SmartCities", "#Sustainability", "#ClimateChange", 
             "#RenewableEnergy", "#ElectricVehicles", "#SpaceExploration", "#Astronomy",
             "#Astrophysics", "#Geology", "#Oceanography", "#Meteorology", "#EnvEngineering", 
             "#Biotech", "#Genetics", "#Microbiology", "#Neuroscience", "#Immunology", 
             "#Pharmacology", "#Medicine", "#Nursing", "#PublicHealth", "#Epidemiology", 
             "#HealthEducation", "#Nutrition", "#Fitness", "#MentalHealth", "#Math", "#Geometry",
             "#Algebra", "#Calculus", "#Statistics", "#Probability", "#NumberTheory", "#LinearAlgebra",
             "#DiscreteMath", "#Topology", "#MathAnalysis", "#MathLogic", "#SetTheory", "#Combinatorics",
             "#GraphTheory", "#MathModeling", "#OperationsResearch", "#Optimization", "#MathPhysics",
             "#ComputationalMath", "#AppliedMath", "#TheoreticalCS", "#Algorithms", "#DataStructures",
             "#ComputerArchitecture", "#ProgrammingLanguages", "#SoftwareDevelopment", "#DatabaseSystems",
             "#ComputerNetworks", "#Grammar", "#Vocabulary", "#ReadingComprehension", "#WritingSkills",
             "#LiteraryAnalysis", "#Poetry", "#Drama", "#Novels", "#ShortStories", "#WorldHistory",
             "#AncientHistory", "#MedievalHistory", "#ModernHistory", "#ContemporaryHistory", "#HistoryOfScience",
             "#HistoryOfTechnology", "#HistoryOfArt", "#HistoryOfCulture", "#WorldGeography", "#Kannada",
             "#Hindi", "#Spanish", "#French", "#Chinese", "#Arabic", "#Russian", "#Portuguese", "#BioEducation", 
             "#ChemEducation", "#EnglishEducation", "#EconEducation", "#PsychEducation", "#SociologyEducation",
             "#PhilosophyEducation", "#AnthropologyEducation", "#EnvSciEducation", "#EdTech", "#DataScience", "#InfoTech", 
             "#SoftwareEng", "#NetSec", "#NeuralNetworks", "#CompVision", "#NLP", "#Robotics", 
             "#CyberSec", "#CloudComputing", "#BigData", "#IoT", "#Blockchain", "#QuantumComputing", 
             "#VirtualReality", "#AugmentedReality", "#MixedReality", "#EdgeComputing", "#5G", "#6G", "#SmartCities",
             "#Sustainability", "#ClimateChange", "#RenewableEnergy", "#ElectricVehicles", "#SpaceExploration", "#Astronomy",
             "#Astrophysics", "#Geology", "#Oceanography", "#Meteorology", "#EnvEngineering", "#Biotech", "#Genetics", "#Microbiology",
             "#Neuroscience", "#Immunology", "#Pharmacology", "#Medicine", "#Nursing", "#PublicHealth", "#Epidemiology", "#HealthEducation", "#Nutrition", "#Fitness", "#MentalHealth",
             "#Math", "#Geometry", "#Algebra", "#Calculus", "#Statistics", "#Probability", "#NumberTheory", "#LinearAlgebra", "#DiscreteMath", "#Topology", "#MathAnalysis",
             "#MathLogic", "#SetTheory", "#Combinatorics", "#GraphTheory", "#MathModeling", "#OperationsResearch", "#Optimization", "#MathPhysics", "#ComputationalMath",
             "#AppliedMath", "#TheoreticalCS", "#Algorithms", "#DataStructures", "#ComputerArchitecture", "#ProgrammingLanguages", "#SoftwareDevelopment", "#DatabaseSystems", "#ComputerNetworks",
             "#Grammar", "#Vocabulary", "#ReadingComprehension", "#WritingSkills", "#LiteraryAnalysis", "#Poetry", "#Drama", "#Novels", "#ShortStories", "#WorldHistory", "#AncientHistory", "#MedievalHistory",
             "#ModernHistory", "#ContemporaryHistory", "#HistoryOfScience", "#HistoryOfTechnology", "#HistoryOfArt", "#HistoryOfCulture", "#WorldGeography", "#Kannada", "#Hindi", "#Spanish", "#French", 
             "#Chinese", "#Arabic", "#Russian", "#Portuguese", "#BioEducation", "#ChemEducation", "#EnglishEducation"]
pdf_urls = ["https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/18-05r-final-exam.pdf"]
data = collect_data(wiki_urls, x_queries, pdf_urls)