from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
import time

from database import get_projects_collection
from schemas import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    SubProjectCreate,
    SubProjectUpdate,
    SubProject,
)

router = APIRouter(prefix="/api/projects", tags=["Projects"])

def clean_doc(doc):
    if doc and "_id" in doc:
        del doc["_id"]
    return doc

@router.get("", response_model=dict)
def get_all_projects():
    collection = get_projects_collection()
    if collection is None:
        return {"success": True, "count": 0, "data": []}
    
    docs = list(collection.find().sort("createdAt", -1))
    projects = [clean_doc(d) for d in docs]
    return {"success": True, "count": len(projects), "data": projects}

@router.get("/{project_id}", response_model=dict)
def get_project_by_id(project_id: str):
    collection = get_projects_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    doc = collection.find_one({"id": project_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"success": True, "data": clean_doc(doc)}

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_project(project_data: ProjectCreate):
    collection = get_projects_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    name = project_data.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Project name is required")
    
    project_id = project_data.id or name.upper().replace(" ", "_")
    
    existing = collection.find_one({"id": project_id})
    if existing:
        raise HTTPException(status_code=400, detail="Project with this ID already exists")
    
    now_str = datetime.utcnow().isoformat()
    new_doc = {
        "id": project_id,
        "name": name,
        "desc": project_data.desc.strip() if project_data.desc else "",
        "baseUrl": project_data.baseUrl.strip() if project_data.baseUrl else "",
        "creationMethod": project_data.creationMethod or "direct",
        "status": project_data.status or "Ongoing",
        "icon": project_data.icon or "folder",
        "category": project_data.category or "General",
        "tags": project_data.tags or [],
        "subProjects": [sp.dict() for sp in (project_data.subProjects or [])],
        "userStoriesCount": project_data.userStoriesCount if project_data.userStoriesCount is not None else 0,
        "testCasesCount": project_data.testCasesCount if project_data.testCasesCount is not None else 0,
        "scriptsCount": project_data.scriptsCount if project_data.scriptsCount is not None else 0,
        "createdAt": now_str,
        "updatedAt": now_str,
    }
    
    collection.insert_one(new_doc)
    return {"success": True, "message": "Project created successfully", "data": clean_doc(new_doc)}

@router.put("/{project_id}", response_model=dict)
def update_project(project_id: str, updates: ProjectUpdate):
    collection = get_projects_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    doc = collection.find_one({"id": project_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = {}
    if updates.name is not None:
        update_data["name"] = updates.name.strip()
    if updates.desc is not None:
        update_data["desc"] = updates.desc.strip()
    if updates.baseUrl is not None:
        update_data["baseUrl"] = updates.baseUrl.strip()
    if updates.creationMethod is not None:
        update_data["creationMethod"] = updates.creationMethod
    if updates.status is not None:
        update_data["status"] = updates.status
    if updates.icon is not None:
        update_data["icon"] = updates.icon
    if updates.category is not None:
        update_data["category"] = updates.category
    if updates.tags is not None:
        update_data["tags"] = updates.tags
    if updates.userStoriesCount is not None:
        update_data["userStoriesCount"] = updates.userStoriesCount
    if updates.testCasesCount is not None:
        update_data["testCasesCount"] = updates.testCasesCount
    if updates.scriptsCount is not None:
        update_data["scriptsCount"] = updates.scriptsCount
    
    update_data["updatedAt"] = datetime.utcnow().isoformat()
    
    collection.update_one({"id": project_id}, {"$set": update_data})
    updated_doc = collection.find_one({"id": project_id})
    return {"success": True, "message": "Project updated", "data": clean_doc(updated_doc)}

@router.delete("/{project_id}", response_model=dict)
def delete_project(project_id: str):
    collection = get_projects_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    res = collection.delete_one({"id": project_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"success": True, "message": "Project deleted successfully", "id": project_id}

@router.post("/{project_id}/subprojects", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_subproject(project_id: str, sub_data: SubProjectCreate):
    collection = get_projects_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    doc = collection.find_one({"id": project_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Parent project not found")
    
    name = sub_data.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Sub-project name is required")
    
    sub_id = sub_data.id or f"{project_id}_{int(time.time() * 1000)}"
    new_sub = {
        "id": sub_id,
        "name": name,
        "desc": sub_data.desc.strip() if sub_data.desc else "",
        "icon": sub_data.icon or "layers",
        "type": sub_data.type or "Web Application",
        "urls": [u.dict() for u in (sub_data.urls or [])],
        "createdAt": datetime.utcnow().isoformat(),
    }
    
    sub_projects = doc.get("subProjects", [])
    sub_projects.append(new_sub)
    
    collection.update_one(
        {"id": project_id},
        {"$set": {"subProjects": sub_projects, "updatedAt": datetime.utcnow().isoformat()}}
    )
    
    updated_doc = collection.find_one({"id": project_id})
    return {"success": True, "message": "Sub-project created successfully", "data": clean_doc(updated_doc)}

@router.delete("/{project_id}/subprojects/{subproject_id}", response_model=dict)
def delete_subproject(project_id: str, subproject_id: str):
    collection = get_projects_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    doc = collection.find_one({"id": project_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Parent project not found")
    
    sub_projects = [sp for sp in doc.get("subProjects", []) if sp.get("id") != subproject_id]
    
    collection.update_one(
        {"id": project_id},
        {"$set": {"subProjects": sub_projects, "updatedAt": datetime.utcnow().isoformat()}}
    )
    
    updated_doc = collection.find_one({"id": project_id})
    return {"success": True, "message": "Sub-project deleted successfully", "data": clean_doc(updated_doc)}

@router.put("/{project_id}/subprojects/{subproject_id}", response_model=dict)
def update_subproject(project_id: str, subproject_id: str, updates: SubProjectUpdate):
    collection = get_projects_collection()
    if collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    doc = collection.find_one({"id": project_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Parent project not found")
    
    sub_projects = doc.get("subProjects", [])
    found = False
    for sp in sub_projects:
        if sp.get("id") == subproject_id:
            found = True
            if updates.name is not None:
                sp["name"] = updates.name.strip()
            if updates.desc is not None:
                sp["desc"] = updates.desc.strip()
            if updates.icon is not None:
                sp["icon"] = updates.icon
            if updates.type is not None:
                sp["type"] = updates.type
            if updates.urls is not None:
                sp["urls"] = [u.dict() for u in updates.urls]
            break
    
    if not found:
        raise HTTPException(status_code=404, detail="Sub-project not found")
    
    collection.update_one(
        {"id": project_id},
        {"$set": {"subProjects": sub_projects, "updatedAt": datetime.utcnow().isoformat()}}
    )
    
    updated_doc = collection.find_one({"id": project_id})
    return {"success": True, "message": "Sub-project updated successfully", "data": clean_doc(updated_doc)}

