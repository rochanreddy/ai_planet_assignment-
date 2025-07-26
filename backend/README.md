# No-Code Intelligent Workflow Builder Backend

## Requirements
- Python 3.9+
- PostgreSQL
- [ChromaDB](https://docs.trychroma.com/)

## Setup
1. Clone this repo and navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables in a `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_key
   SERPAPI_KEY=your_serpapi_key
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/yourdb
   CHROMA_DB_IMPL=chromadb.db.impl.sqlite.SQLiteDB
   CHROMA_DB_PATH=./chroma_db
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

## Project Structure
- `main.py`: FastAPI entrypoint
- `routers/`: API route handlers
- `services/`: Business logic
- `schemas/`: Pydantic models
- `models/`: Database models

## Example Usage
- Upload a PDF: `POST /upload`
- Query: `POST /query`

---

For more, see the API docs at `/docs` after running the server. 