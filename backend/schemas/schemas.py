from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    content: str

class DocumentCreate(DocumentBase):
    pass

class DocumentOut(DocumentBase):
    id: int
    upload_date: datetime

    class Config:
        from_attributes = True

class WorkflowBase(BaseModel):
    name: str
    config_json: str

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowOut(WorkflowBase):
    id: int

    class Config:
        from_attributes = True

class ChatLogBase(BaseModel):
    user_query: str
    response: str
    workflow_id: Optional[int]

class ChatLogCreate(ChatLogBase):
    pass

class ChatLogOut(ChatLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    document_id: int
    content: str

class QueryRequest(BaseModel):
    user_query: str
    context: Optional[Any] = None
    custom_prompt: Optional[str] = None

class QueryResponse(BaseModel):
    response: str 