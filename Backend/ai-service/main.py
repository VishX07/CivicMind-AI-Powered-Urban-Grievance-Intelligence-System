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
    
    water_keywords = ["water", "leak", "pipe", "tap", "supply", "drainage"]
    road_keywords = ["road", "pothole", "damage", "crack", "pavement", "highway"]
    light_keywords = ["light", "streetlight", "electric", "lamp", "bulb", "pole"]
    waste_keywords = ["garbage", "waste", "trash", "litter", "rubbish", "dirt"]
    sanitation_keywords = ["drain", "sewage", "toilet", "bathroom", "sewer", "manhole"]
    
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

def calculate_priority(description: str) -> int:
    description_lower = description.lower()
    
    priority = 3
    
    if "urgent" in description_lower:
        priority += 2
    if "danger" in description_lower or "dangerous" in description_lower:
        priority += 2
    if "accident" in description_lower:
        priority += 3
    if "blocked" in description_lower or "block" in description_lower:
        priority += 1
    if "flood" in description_lower or "flooding" in description_lower:
        priority += 3
    
    priority = max(0, min(priority, 10))
    
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