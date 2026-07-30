from pydantic import BaseModel
from typing import List, Optional

class EnvironmentUrl(BaseModel):
    id: Optional[str] = None
    env: str
    url: str

class SubProjectCreate(BaseModel):
    id: Optional[str] = None
    name: str
    desc: Optional[str] = ""
    type: Optional[str] = "Web Application"
    urls: Optional[List[EnvironmentUrl]] = []
    userStoriesCount: Optional[int] = 0
    testCasesCount: Optional[int] = 0
    scriptsCount: Optional[int] = 0

class SubProject(BaseModel):
    id: str
    name: str
    desc: Optional[str] = ""
    type: Optional[str] = "Web Application"
    urls: Optional[List[EnvironmentUrl]] = []
    userStoriesCount: Optional[int] = 0
    testCasesCount: Optional[int] = 0
    scriptsCount: Optional[int] = 0
    createdAt: Optional[str] = None

class SubProjectUpdate(BaseModel):
    name: Optional[str] = None
    desc: Optional[str] = None
    type: Optional[str] = None
    urls: Optional[List[EnvironmentUrl]] = None
    userStoriesCount: Optional[int] = None
    testCasesCount: Optional[int] = None
    scriptsCount: Optional[int] = None

class ProjectCreate(BaseModel):
    id: Optional[str] = None
    name: str
    desc: Optional[str] = ""
    baseUrl: Optional[str] = ""
    status: Optional[str] = "Ongoing"
    icon: Optional[str] = "folder"
    category: Optional[str] = "General"
    subProjects: Optional[List[SubProject]] = []

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    desc: Optional[str] = None
    baseUrl: Optional[str] = None
    status: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    desc: Optional[str] = ""
    baseUrl: Optional[str] = ""
    status: Optional[str] = "Ongoing"
    icon: Optional[str] = "folder"
    category: Optional[str] = "General"
    subProjects: Optional[List[SubProject]] = []
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
