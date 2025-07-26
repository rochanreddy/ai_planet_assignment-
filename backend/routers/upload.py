from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from models.models import Document
from services.db import get_session
from schemas.schemas import UploadResponse
import fitz  # PyMuPDF

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...), session: AsyncSession = Depends(get_session)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    try:
        content = b""
        while chunk := await file.read(1024 * 1024):
            content += chunk
        doc = fitz.open(stream=content, filetype="pdf")
        text = "\n".join(page.get_text() for page in doc)
        db_doc = Document(filename=file.filename, content=text)
        session.add(db_doc)
        await session.commit()
        await session.refresh(db_doc)
        return UploadResponse(document_id=db_doc.id, content=text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}") 