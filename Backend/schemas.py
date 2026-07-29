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

class SubProjectUpdate(BaseModel):
    name: Optional[str] = None
    desc: Optional[str] = None
    icon: Optional[str] = None
    type: Optional[str] = None
    urls: Optional[List[EnvironmentUrl]] = None

class ProjectCreate(BaseModel):
    id: Optional[str] = None
    name: str
    desc: Optional[str] = ""
    baseUrl: Optional[str] = ""
    creationMethod: Optional[str] = "direct"
    status: Optional[str] = "Ongoing"
    icon: Optional[str] = "folder"
    category: Optional[str] = "General"
    tags: Optional[List[str]] = []
    subProjects: Optional[List[SubProject]] = []
    userStoriesCount: Optional[int] = 0
    testCasesCount: Optional[int] = 0
    scriptsCount: Optional[int] = 0

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    desc: Optional[str] = None
    baseUrl: Optional[str] = None
    creationMethod: Optional[str] = None
    status: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    userStoriesCount: Optional[int] = None
    testCasesCount: Optional[int] = None
    scriptsCount: Optional[int] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    desc: Optional[str] = ""
    baseUrl: Optional[str] = ""
    creationMethod: Optional[str] = "direct"
    status: Optional[str] = "Ongoing"
    icon: Optional[str] = "folder"
    category: Optional[str] = "General"
    tags: Optional[List[str]] = []
    subProjects: Optional[List[SubProject]] = []
    userStoriesCount: Optional[int] = 0
    testCasesCount: Optional[int] = 0
    scriptsCount: Optional[int] = 0
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
