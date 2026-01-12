# Routes package
from app.routes.clients import router as clients_router
from app.routes.cases import router as cases_router

__all__ = ["clients_router", "cases_router"]
