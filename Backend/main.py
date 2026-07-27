import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes_projects import router as projects_router

load_dotenv()

PORT = int(os.getenv("PORT", 5000))

app = FastAPI(
    title="AI-First Test DNA — Python REST API",
    description="Python FastAPI + PyMongo + MongoDB Backend REST API Service for Projects and Subprojects",
    version="1.0.0",
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(projects_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "UP",
        "service": "AI-First Test DNA Python REST API (FastAPI + PyMongo)",
        "docs": "http://localhost:5000/docs",
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
