import torch
import yaml
import json
from transformers import AutoTokenizer
from app.model import ComplaintClassifier


class ComplaintPredictor:

    BASE_PRIORITY = {
        "Water Supply": 9,
        "Road Damage": 8,
        "Public Property Damage": 8,
        "Electricity Issue": 8,
        "Illegal Construction": 7,
        "Drainage Issue": 7,
        "Street Lights": 6,
        "Garbage Collection": 6,
        "Encroachment": 5,
        "Noise Pollution": 4,
        "Stray Animals": 4,
        "Tree Related": 3
    }

    KEYWORD_CATEGORY_MAP = {
        "Public Property Damage": [
            "hospital", "school", "government building",
            "public building", "bridge broken",
            "building collapse", "tuta hua",
            "gir gaya", "gir gya", "tut gya"
        ],

        "Water Supply": [
            "paani nahi", "pani nahi",
            "water not coming", "no water",
            "pipeline phat", "pipeline burst"
        ],

        "Road Damage": [
            "gadda", "khadda", "pothole",
            "road broken", "road crack",
            "bada hole", "sadak kharab"
        ],

        "Electricity Issue": [
            "bijli nahi", "power cut",
            "light nahi", "electric pole",
            "sparking", "wire hanging"
        ],

        "Garbage Collection": [
            "kachra", "garbage",
            "dustbin full", "overflowing garbage",
            "waste collection"
        ],

        "Drainage Issue": [
            "drain jam", "nala block",
            "sewage overflow", "nala jam",
            "drain problem"
        ],

        "Illegal Construction": [
            "illegal construction",
            "unauthorized building",
            "illegal building",
            "without permission construction"
        ],

        "Noise Pollution": [
            "loud music",
            "dj sound",
            "noise problem",
            "loudspeaker",
            "horn problem"
        ],

        "Tree Related": [
            "tree fallen",
            "tree cut",
            "tree blocking road",
            "tree blocking the road",
            "dangerous tree"
        ],

        "Street Lights": [
            "street light not working",
            "light pole broken",
            "streetlight fuse",
            "street light band"
        ]
    }

    def __init__(self, model_path, mappings_path, config_path="app/config.yaml"):

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        with open(config_path, "r") as f:
            self.config = yaml.safe_load(f)

        with open(mappings_path, "r") as f:
            mappings = json.load(f)

        self.category_to_idx = mappings["category_to_idx"]
        self.idx_to_category = {
            int(k): v for k, v in mappings["idx_to_category"].items()
        }
        self.num_categories = len(self.category_to_idx)

        self.tokenizer = AutoTokenizer.from_pretrained(
            self.config["model"]["name"]
        )

        self.model = ComplaintClassifier(
            model_name=self.config["model"]["name"],
            num_categories=self.num_categories,
            classifier_hidden_size=self.config["model"]["classifier_hidden_size"],
            dropout=self.config["model"]["hidden_dropout_prob"]
        )

        checkpoint = torch.load(model_path, map_location=self.device)
        self.model.load_state_dict(checkpoint)

        self.model.to(self.device)
        self.model.eval()

    def _keyword_override(self, text):
        text = text.lower()

        for category, keywords in self.KEYWORD_CATEGORY_MAP.items():
            if any(word in text for word in keywords):
                return category

        return None

    def _calculate_priority(self, category, confidence):

        base = self.BASE_PRIORITY.get(category, 5)

        boost = 0
        if confidence >= 0.85:
            boost = 2
        elif confidence >= 0.75:
            boost = 1

        return min(10, base + boost)

    def predict(self, text):

        encoding = self.tokenizer(
            text,
            max_length=self.config["model"]["max_length"],
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )

        input_ids = encoding["input_ids"].to(self.device)
        attention_mask = encoding["attention_mask"].to(self.device)

        with torch.no_grad():
            logits = self.model(input_ids, attention_mask)
            probs = torch.softmax(logits, dim=-1)
            confidence_tensor, pred = torch.max(probs, dim=-1)

        category = self.idx_to_category[pred.item()]
        confidence = confidence_tensor.item()

        override_category = self._keyword_override(text)

        # Apply override only if model confidence is low
        if override_category and confidence < 0.75:
            category = override_category

        priority = self._calculate_priority(category, confidence)

        return {
            "category": category,
            "confidence": confidence,
            "priority": priority
        }

    def get_categories(self):
        return list(self.category_to_idx.keys())
