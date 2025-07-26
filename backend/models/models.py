from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.asyncio import AsyncAttrs, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class Document(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)

class Workflow(Base):
    __tablename__ = 'workflows'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    config_json = Column(Text, nullable=False)

class ChatLog(Base):
    __tablename__ = 'chatlogs'
    id = Column(Integer, primary_key=True, index=True)
    user_query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    workflow_id = Column(Integer, ForeignKey('workflows.id'))
    workflow = relationship('Workflow') 