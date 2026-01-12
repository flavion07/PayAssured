import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import clients_router, cases_router
from settings import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PayAssured CRM API",
    description="Internal CRM module for PayAssured",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(clients_router)
app.include_router(cases_router)


@app.get("/")
def root():
    return {
        "message": "PayAssured CRM API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
