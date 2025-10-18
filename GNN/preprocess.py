import torch
from torch_geometric.data import Data
import json
import numpy as np  # For dummy features

def preprocess_graph(json_file="graph_export.json"):
    with open(json_file, "r") as f:
        data = json.load(f)
    
    print(f"Loaded data: {len(data.get('nodes', []))} nodes, {len(data.get('edges', []))} edges")  # Debug
    
    if not data.get('nodes'):
        print("Error: No nodes in export. Run export_graph.py and check Neo4j.")
        return None
    
    # Collect nodes and create features
    node_names = []
    features_list = []
    node_types = []
    for node in data["nodes"]:
        name = node.get("name")
        if not name:
            print(f"Skipping node without name: {node}")  # Debug
            continue
        node_names.append(name)
        content = node.get("content", name)  # Fallback
        # Dummy feature: one-hot type + random (128-dim)
        type_map = {"TOPIC": 0, "GPE": 1, "LOC": 2, "ORG": 3, "UNKNOWN": 4}
        type_idx = type_map.get(node.get("type", "UNKNOWN"), 4)
        feature = np.random.rand(128).astype(np.float32)
        feature[0] = type_idx / 5.0  # Encode type
        features_list.append(feature)
        node_types.append(node.get("type", "UNKNOWN"))
    
    num_nodes = len(features_list)
    if num_nodes == 0:
        print("Error: No valid nodes added. Check 'name' keys in graph_export.json.")
        return None
    
    x = torch.tensor(features_list, dtype=torch.float)  # Node features tensor
    print(f"Created features tensor: {x.shape}")  # Debug
    
    # Create edge_index
    edge_index_list = []
    for edge in data["edges"]:
        source = edge.get("source")
        target = edge.get("target")
        if source in node_names and target in node_names:
            source_idx = node_names.index(source)
            target_idx = node_names.index(target)
            edge_index_list.append([source_idx, target_idx])
    
    if edge_index_list:
        edge_index = torch.tensor(edge_index_list, dtype=torch.long).t().contiguous()
    else:
        edge_index = torch.empty((2, 0), dtype=torch.long)  # Empty edges tensor
    print(f"Created edge_index: {edge_index.shape}")  # Debug
    
    # Create PyG Data object
    pyg_data = Data(x=x, edge_index=edge_index)
    
    # Add train/test masks (80/20 split)
    pyg_data.train_mask = torch.zeros(num_nodes, dtype=torch.bool)
    pyg_data.train_mask[:int(0.8 * num_nodes)] = True
    
    torch.save(pyg_data, "graph_data.pt")
    print(f"Preprocessed graph: {num_nodes} nodes, {edge_index.shape[1]} edges")
    return pyg_data

# Run
preprocess_graph()