import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import upload_router, query_router

load_dotenv()

app = FastAPI()

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers (to be included)
# app.include_router(upload_router)  # Temporarily disabled due to database dependency
app.include_router(query_router)

# print("DATABASE_URL:", os.getenv("DATABASE_URL"))  # Temporarily disabled

@app.get("/")
def root():
    return {"message": "No-Code Workflow Builder Backend running."} 

@app.get("/test")
def test():
    return {"response": "Backend is working! This is a test response without OpenAI."}

@app.post("/test-query")
def test_query():
    return {"response": "Test response: Your query was received successfully by the backend!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 