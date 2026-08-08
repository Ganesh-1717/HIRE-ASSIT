"""
SBERT Embedding Microservice for HireAssist
Provides sentence embeddings using all-MiniLM-L6-v2 for semantic job matching.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np
import uvicorn

app = FastAPI(title="HireAssist SBERT Service", version="1.0.0")

# Load model once at startup — avoids reloading per request
model: SentenceTransformer = None


@app.on_event("startup")
async def load_model():
    global model
    print("Loading sentence-transformers model: all-MiniLM-L6-v2 ...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("Model loaded successfully.")


class EmbedRequest(BaseModel):
    texts: List[str]


class EmbedResponse(BaseModel):
    embeddings: List[List[float]]


@app.get("/health")
def health():
    return {"status": "ok", "model": "all-MiniLM-L6-v2"}


@app.post("/embed", response_model=EmbedResponse)
def embed(request: EmbedRequest):
    if not request.texts:
        raise HTTPException(status_code=400, detail="No texts provided")
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    # Encode returns numpy array of shape (n, 384)
    embeddings: np.ndarray = model.encode(request.texts, convert_to_numpy=True, normalize_embeddings=True)
    return EmbedResponse(embeddings=embeddings.tolist())


if __name__ == "__main__":
    uvicorn.run("sbert_server:app", host="0.0.0.0", port=8001, reload=False)
