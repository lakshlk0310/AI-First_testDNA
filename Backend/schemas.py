from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class EnvironmentUrl(BaseModel):
    env: str
    url: str

class SubProjectCreate(BaseModel):
    id: Optional[str] = None
    name: str
    desc: Optional[str] = ""
    icon: Optional[str] = "layers"
    type: Optional[str] = "Web Application"
    urls: Optional[List[EnvironmentUrl]] = []

class SubProject(BaseModel):
    id: str
    name: str
    desc: Optional[str] = ""
    icon: Optional[str] = "layers"
    type: Optional[str] = "Web Application"
    urls: Optional[List[EnvironmentUrl]] = []
    createdAt: Optional[str] = None

class ProjectCreate(BaseModel):
    id: Optional[str] = None
    name: str
    desc: Optional[str] = ""
    icon: Optional[str] = "folder"
    category: Optional[str] = "General"
    tags: Optional[List[str]] = []
    subProjects: Optional[List[SubProject]] = []

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    desc: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    desc: Optional[str] = ""
    icon: Optional[str] = "folder"
    category: Optional[str] = "General"
    tags: Optional[List[str]] = []
    subProjects: Optional[List[SubProject]] = []
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
