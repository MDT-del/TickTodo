from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from pymongo import MongoClient
from bson import ObjectId
import os
import uuid
from enum import Enum
import khayyam

app = FastAPI(title="Persian Todo API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client.persian_todo

# Collections
tasks_collection = db.tasks
lists_collection = db.lists
tags_collection = db.tags
settings_collection = db.settings

class Priority(str, Enum):
    LOW = "کم"
    MEDIUM = "متوسط"
    HIGH = "بالا"

class TaskStatus(str, Enum):
    PENDING = "در انتظار"
    COMPLETED = "تکمیل شده"
    CANCELLED = "لغو شده"

# Pydantic models
class TaskModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    status: TaskStatus = TaskStatus.PENDING
    due_date: Optional[date] = None
    due_time: Optional[str] = None
    list_id: Optional[str] = None
    tags: List[str] = []
    subtasks: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    due_date: Optional[date] = None
    due_time: Optional[str] = None
    list_id: Optional[str] = None
    tags: List[str] = []

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[date] = None
    due_time: Optional[str] = None
    list_id: Optional[str] = None
    tags: Optional[List[str]] = None

class ListModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    color: str = "#3B82F6"
    icon: str = "📋"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    task_count: int = 0

class ListCreate(BaseModel):
    name: str
    color: str = "#3B82F6"
    icon: str = "📋"

class TagModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    color: str = "#10B981"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TagCreate(BaseModel):
    name: str
    color: str = "#10B981"

class SubtaskModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Helper functions
def task_dict_to_model(task_dict: dict) -> dict:
    """Convert MongoDB document to API response format"""
    if task_dict:
        task_dict['_id'] = str(task_dict['_id'])
        # Convert datetime to ISO format
        if 'created_at' in task_dict:
            task_dict['created_at'] = task_dict['created_at'].isoformat()
        if 'updated_at' in task_dict:
            task_dict['updated_at'] = task_dict['updated_at'].isoformat()
        if 'completed_at' in task_dict and task_dict['completed_at']:
            task_dict['completed_at'] = task_dict['completed_at'].isoformat()
        # due_date is already stored as string, no conversion needed
    return task_dict

def get_today_persian():
    """Get today's date in Persian calendar format"""
    today_persian = khayyam.JalaliDatetime.now()
    return today_persian.date()

def convert_persian_to_gregorian(persian_date_str):
    """Convert Persian date string to Gregorian date"""
    if not persian_date_str:
        return None
    try:
        # Persian date is in YYYY-MM-DD format (Gregorian equivalent)
        return datetime.strptime(persian_date_str, '%Y-%m-%d').date()
    except:
        return None

def is_today_persian(date_obj):
    """Check if the given date is today in Persian calendar"""
    if not date_obj:
        return False
    
    if isinstance(date_obj, str):
        date_obj = convert_persian_to_gregorian(date_obj)
    
    if not date_obj:
        return False
        
    today = datetime.utcnow().date()
    return date_obj == today

# API Routes

@app.get("/api/")
async def root():
    return {"message": "Persian Todo API is running", "version": "1.0.0"}

@app.get("/api/persian-date")
async def get_persian_date():
    """Get current Persian date information"""
    try:
        now = khayyam.JalaliDatetime.now()
        today = datetime.utcnow().date()
        
        return {
            "persian_date": now.strftime('%Y/%m/%d'),
            "persian_date_long": now.strftime('%A، %d %B %Y'),
            "persian_time": now.strftime('%H:%M'),
            "gregorian_date": today.isoformat(),
            "day_name": now.strftime('%A'),
            "month_name": now.strftime('%B'),
            "year": now.year,
            "month": now.month,
            "day": now.day
        }
    except Exception as e:
        return {
            "persian_date": "تاریخ در دسترس نیست",
            "error": str(e)
        }

# Tasks endpoints
@app.get("/api/tasks", response_model=List[dict])
async def get_tasks(
    list_id: Optional[str] = None,
    status: Optional[TaskStatus] = None,
    priority: Optional[Priority] = None,
    search: Optional[str] = None
):
    """Get all tasks with optional filtering"""
    query = {}
    
    if list_id:
        query["list_id"] = list_id
    if status:
        query["status"] = status
    if priority:
        query["priority"] = priority
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    tasks = list(tasks_collection.find(query).sort("created_at", -1))
    return [task_dict_to_model(task) for task in tasks]

@app.get("/api/tasks/{task_id}")
async def get_task(task_id: str):
    """Get a specific task by ID"""
    task = tasks_collection.find_one({"id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="تسک پیدا نشد")
    return task_dict_to_model(task)

@app.post("/api/tasks", response_model=dict)
async def create_task(task: TaskCreate):
    """Create a new task"""
    task_dict = task.dict()
    task_dict["id"] = str(uuid.uuid4())
    task_dict["status"] = TaskStatus.PENDING
    task_dict["created_at"] = datetime.utcnow()
    task_dict["updated_at"] = datetime.utcnow()
    task_dict["subtasks"] = []
    
    # Convert date to string if provided
    if task_dict.get("due_date"):
        if isinstance(task_dict["due_date"], date):
            task_dict["due_date"] = task_dict["due_date"].isoformat()
    
    result = tasks_collection.insert_one(task_dict)
    if result.inserted_id:
        # Update list task count
        if task.list_id:
            lists_collection.update_one(
                {"id": task.list_id},
                {"$inc": {"task_count": 1}}
            )
        return task_dict_to_model(task_dict)
    raise HTTPException(status_code=500, detail="خطا در ایجاد تسک")

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: str, task_update: TaskUpdate):
    """Update an existing task"""
    update_data = {k: v for k, v in task_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # Convert date to string if provided
    if update_data.get("due_date"):
        if isinstance(update_data["due_date"], date):
            update_data["due_date"] = update_data["due_date"].isoformat()
    
    # Handle status change to completed
    if update_data.get("status") == TaskStatus.COMPLETED:
        update_data["completed_at"] = datetime.utcnow()
    elif update_data.get("status") == TaskStatus.PENDING:
        update_data["completed_at"] = None
    
    result = tasks_collection.update_one(
        {"id": task_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="تسک پیدا نشد")
    
    updated_task = tasks_collection.find_one({"id": task_id})
    return task_dict_to_model(updated_task)

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task"""
    task = tasks_collection.find_one({"id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="تسک پیدا نشد")
    
    result = tasks_collection.delete_one({"id": task_id})
    if result.deleted_count == 1:
        # Update list task count
        if task.get("list_id"):
            lists_collection.update_one(
                {"id": task["list_id"]},
                {"$inc": {"task_count": -1}}
            )
        return {"message": "تسک با موفقیت حذف شد"}
    raise HTTPException(status_code=500, detail="خطا در حذف تسک")

# Lists endpoints
@app.get("/api/lists", response_model=List[dict])
async def get_lists():
    """Get all lists"""
    lists = list(lists_collection.find().sort("created_at", -1))
    return [task_dict_to_model(lst) for lst in lists]

@app.post("/api/lists", response_model=dict)
async def create_list(list_data: ListCreate):
    """Create a new list"""
    list_dict = list_data.dict()
    list_dict["id"] = str(uuid.uuid4())
    list_dict["created_at"] = datetime.utcnow()
    list_dict["task_count"] = 0
    
    result = lists_collection.insert_one(list_dict)
    if result.inserted_id:
        return task_dict_to_model(list_dict)
    raise HTTPException(status_code=500, detail="خطا در ایجاد لیست")

@app.put("/api/lists/{list_id}")
async def update_list(list_id: str, list_update: ListCreate):
    """Update an existing list"""
    update_data = list_update.dict()
    
    result = lists_collection.update_one(
        {"id": list_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="لیست پیدا نشد")
    
    updated_list = lists_collection.find_one({"id": list_id})
    return task_dict_to_model(updated_list)

@app.delete("/api/lists/{list_id}")
async def delete_list(list_id: str):
    """Delete a list and all its tasks"""
    list_obj = lists_collection.find_one({"id": list_id})
    if not list_obj:
        raise HTTPException(status_code=404, detail="لیست پیدا نشد")
    
    # Delete all tasks in this list
    tasks_collection.delete_many({"list_id": list_id})
    
    # Delete the list
    result = lists_collection.delete_one({"id": list_id})
    if result.deleted_count == 1:
        return {"message": "لیست و تمام تسک‌های آن با موفقیت حذف شد"}
    raise HTTPException(status_code=500, detail="خطا در حذف لیست")

# Tags endpoints
@app.get("/api/tags", response_model=List[dict])
async def get_tags():
    """Get all tags"""
    tags = list(tags_collection.find().sort("created_at", -1))
    return [task_dict_to_model(tag) for tag in tags]

@app.post("/api/tags", response_model=dict)
async def create_tag(tag: TagCreate):
    """Create a new tag"""
    tag_dict = tag.dict()
    tag_dict["id"] = str(uuid.uuid4())
    tag_dict["created_at"] = datetime.utcnow()
    
    result = tags_collection.insert_one(tag_dict)
    if result.inserted_id:
        return task_dict_to_model(tag_dict)
    raise HTTPException(status_code=500, detail="خطا در ایجاد برچسب")

@app.delete("/api/tags/{tag_id}")
async def delete_tag(tag_id: str):
    """Delete a tag"""
    tag = tags_collection.find_one({"id": tag_id})
    if not tag:
        raise HTTPException(status_code=404, detail="برچسب پیدا نشد")
    
    result = tags_collection.delete_one({"id": tag_id})
    if result.deleted_count == 1:
        return {"message": "برچسب با موفقیت حذف شد"}
    raise HTTPException(status_code=500, detail="خطا در حذف برچسب")

# Subtasks endpoints
@app.post("/api/tasks/{task_id}/subtasks")
async def add_subtask(task_id: str, subtask: SubtaskModel):
    """Add a subtask to a task"""
    subtask_dict = subtask.dict()
    subtask_dict["id"] = str(uuid.uuid4())
    subtask_dict["created_at"] = datetime.utcnow()
    
    result = tasks_collection.update_one(
        {"id": task_id},
        {"$push": {"subtasks": subtask_dict}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="تسک پیدا نشد")
    
    return {"message": "زیر تسک با موفقیت اضافه شد", "subtask": subtask_dict}

@app.put("/api/tasks/{task_id}/subtasks/{subtask_id}")
async def update_subtask(task_id: str, subtask_id: str, completed: bool):
    """Update subtask completion status"""
    result = tasks_collection.update_one(
        {"id": task_id, "subtasks.id": subtask_id},
        {"$set": {"subtasks.$.completed": completed}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="تسک یا زیر تسک پیدا نشد")
    
    return {"message": "وضعیت زیر تسک به‌روزرسانی شد"}

@app.delete("/api/tasks/{task_id}/subtasks/{subtask_id}")
async def delete_subtask(task_id: str, subtask_id: str):
    """Delete a subtask"""
    result = tasks_collection.update_one(
        {"id": task_id},
        {"$pull": {"subtasks": {"id": subtask_id}}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="تسک یا زیر تسک پیدا نشد")
    
    return {"message": "زیر تسک با موفقیت حذف شد"}

# Statistics endpoints
@app.get("/api/stats")
async def get_stats():
    """Get dashboard statistics"""
    total_tasks = tasks_collection.count_documents({})
    completed_tasks = tasks_collection.count_documents({"status": TaskStatus.COMPLETED})
    pending_tasks = tasks_collection.count_documents({"status": TaskStatus.PENDING})
    total_lists = lists_collection.count_documents({})
    
    # Tasks by priority
    high_priority = tasks_collection.count_documents({"priority": Priority.HIGH, "status": TaskStatus.PENDING})
    medium_priority = tasks_collection.count_documents({"priority": Priority.MEDIUM, "status": TaskStatus.PENDING})
    low_priority = tasks_collection.count_documents({"priority": Priority.LOW, "status": TaskStatus.PENDING})
    
    # Tasks due today (Persian calendar)
    today = datetime.utcnow().date()
    due_today = tasks_collection.count_documents({
        "due_date": today.isoformat(),
        "status": TaskStatus.PENDING
    })
    
    # Recent tasks
    recent_tasks = list(tasks_collection.find({"status": TaskStatus.PENDING})
                       .sort("created_at", -1)
                       .limit(5))
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "total_lists": total_lists,
        "high_priority": high_priority,
        "medium_priority": medium_priority,
        "low_priority": low_priority,
        "due_today": due_today,
        "recent_tasks": [task_dict_to_model(task) for task in recent_tasks],
        "completion_rate": round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)