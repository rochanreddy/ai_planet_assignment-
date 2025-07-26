from fastapi import APIRouter, HTTPException
from schemas.schemas import QueryRequest, QueryResponse
import os
import httpx
import json

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("GEMINI_API_KEY:", GEMINI_API_KEY)  # DEBUG: Show which key is loaded
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

@router.post("/query", response_model=QueryResponse)
async def query_llm(request: QueryRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not set.")
    
    # Temporary: Return a test response to bypass rate limit
    if "test" in request.user_query.lower():
        return QueryResponse(response="This is a test response from the backend! Your query was: " + request.user_query)
    
    prompt = request.custom_prompt or request.user_query
    try:
        async with httpx.AsyncClient() as client:
            # Gemini API request format
            gemini_request = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            }
            
            resp = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json=gemini_request,
                timeout=30.0
            )
            resp.raise_for_status()
            data = resp.json()
            
            # Extract response from Gemini API format
            if "candidates" in data and len(data["candidates"]) > 0:
                answer = data["candidates"][0]["content"]["parts"][0]["text"]
            else:
                answer = "No response from Gemini."
                
            return QueryResponse(response=answer)
    except Exception as e:
        # If it's a rate limit error, return a helpful message
        if "429" in str(e):
            return QueryResponse(response="Gemini API rate limit reached. Please wait a moment and try again. For testing, try asking something with 'test' in it.")
        raise HTTPException(status_code=500, detail=f"LLM query failed: {str(e)}") 