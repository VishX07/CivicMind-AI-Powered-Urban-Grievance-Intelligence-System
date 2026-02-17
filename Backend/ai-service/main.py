# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    description: str
    imageUrl: Optional[str] = None

class PredictResponse(BaseModel):
    category: str
    priority: int

def classify_category(description: str) -> str:
    description_lower = description.lower()
    
    water_keywords = ["water", "leak", "pipe", "tap", "supply", "drainage" ,"pani nahi","pani", "pani band", "pani nahi aa raha"]
    road_keywords = ["road", "pothole", "damage", "crack", "pavement", "highway","block", "khadda", "khaddha", "gaddha", "gadda", "bada khadda", "bada gaddha"]
    light_keywords = ["light", "streetlight", "electric", "lamp", "bulb", "pole", "not working", "fuse", "band hai", "blink kar raha", "short circuit"]
    waste_keywords = ["garbage", "waste", "trash", "litter", "rubbish", "dirt", "kachra", "garbage pile", "dirty", "bahut kachra"]
    sanitation_keywords = ["drain", "sewage", "toilet", "bathroom", "sewer", "manhole", "blocked", "choked", "sewer jam", "drain jam"]
    
    if any(keyword in description_lower for keyword in water_keywords):
        return "Water Supply"
    elif any(keyword in description_lower for keyword in road_keywords):
        return "Road Damage"
    elif any(keyword in description_lower for keyword in light_keywords):
        return "Streetlights"
    elif any(keyword in description_lower for keyword in waste_keywords):
        return "Waste Management"
    elif any(keyword in description_lower for keyword in sanitation_keywords):
        return "Sanitation"
    else:
        return "Others"

# def calculate_priority(description: str) -> int:
#     description_lower = description.lower()
    
#     priority = 3
    
#     if "urgent" in description_lower:
#         priority += 2
#     if "danger" in description_lower or "dangerous" in description_lower:
#         priority += 2
#     if "accident" in description_lower:
#         priority += 3
#     if "blocked" in description_lower or "block" in description_lower:
#         priority += 1
#     if "flood" in description_lower or "flooding" in description_lower:
#         priority += 3
    
#     priority = max(0, min(priority, 10))
    
#     return priority
def calculate_priority(description: str, category: str) -> int:
    description_lower = description.lower()

    # --------------------------
    # 1. Base Priority by Category
    # --------------------------
    base_priority_map = {
        "Water Supply": 6,
        "Sanitation": 6,
        "Road Damage": 5,
        "Streetlights": 4,
        "Waste Management": 4,
        "Others": 3
    }

    priority = base_priority_map.get(category, 3)

    # --------------------------
    # 2. High Severity Keywords (+3)
    # --------------------------
    high_severity_keywords = [
        "accident", "injury", "electrocution", "fire",
        "collapsed", "burst", "overflowing", "major flooding",
        "bahut bada", "bahot bada", "serious", "danger",
        "jaanleva", "electric shock"
    ]

    if any(word in description_lower for word in high_severity_keywords):
        priority += 3

    # --------------------------
    # 3. Medium Severity Keywords (+2)
    # --------------------------
    medium_severity_keywords = [
        # pothole variations
        "pothole", "big pothole", "deep pothole",
        "khadda", "khaddha", "gaddha", "gadda",
        "bada khadda", "bada gaddha",

        # water issues
        "no water", "water not coming", "pani nahi",
        "pani band", "pani nahi aa raha",
        "leak", "leakage", "pipe tut gaya",

        # streetlight
        "not working", "fuse", "band hai",
        "blink kar raha", "short circuit",

        # sanitation
        "blocked", "block", "choked", "jam",
        "sewer jam", "drain jam",

        # waste
        "bahut kachra", "garbage pile", "dirty"
    ]

    if any(word in description_lower for word in medium_severity_keywords):
        priority += 2

    # --------------------------
    # 4. Time Based Escalation (+2 or +3)
    # --------------------------
    time_keywords_medium = [
        "2 din", "3 din", "do din", "teen din",
        "few days", "kaafi din", "kafi din",
        "kafi din se", "kaafi din se",
        "din se", "since days"
    ]

    time_keywords_high = [
        "1 week", "ek hafte", "hafto se",
        "many days", "long time", "mahine se",
        "1 month"
    ]

    if any(word in description_lower for word in time_keywords_high):
        priority += 3
    elif any(word in description_lower for word in time_keywords_medium):
        priority += 2

    # --------------------------
    # 5. Scale / Location Impact (+1 or +2)
    # --------------------------
    scale_keywords = [
        "colony", "area", "society", "main road",
        "school ke paas", "hospital ke paas",
        "public place", "market", "bazaar"
    ]

    if any(word in description_lower for word in scale_keywords):
        priority += 1

    # --------------------------
    # 6. Clamp between 1 and 10
    # --------------------------
    priority = max(1, min(priority, 10))

    return priority

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {"message": "AI Service Running", "status": "ok"}

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    category = classify_category(request.description)
    priority = calculate_priority(request.description)
    
    return PredictResponse(
        category=category,
        priority=priority
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)