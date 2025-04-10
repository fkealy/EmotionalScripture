from typing import List, Optional
from pydantic import BaseModel, Field

class Quote(BaseModel):
    author: str
    scriptureSource: str
    sourceURL: str
    quote: str
    relevance: Optional[str] = None
    tags: Optional[List[str]] = None

class ReligionData(BaseModel):
    summary: str
    ideas: str
    quotes: List[Quote]

class EmotionData(BaseModel):
    name: str
    color: str
    text: str
    parent: Optional[str] = None
    christianity: ReligionData
    buddhism: ReligionData
    hinduism: ReligionData
    islam: ReligionData
    sikhism: ReligionData 