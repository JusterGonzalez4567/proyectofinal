# main.py
from fastapi import FastAPI, HTTPException, Depends, status

from fastapi.middleware.cors import CORSMiddleware
# main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel
from passlib.context import CryptContext
from typing import Optional

app = FastAPI()

# Configuración CORS
origins = [
    "http://localhost:8000/Users",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["http://localhost:8000/Users"],
    allow_headers=["http://localhost:8000/Users"],
)

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["vet_app"]
users_collection = db["users"]

# Configuración de seguridad para el hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    username: str
    email: str
    password: str

class UserInDB(User):
    id: ObjectId

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@app.post("/register", response_model=UserInDB)
async def register(user: User):
    user_dict = user.dict()
    user_dict["password"] = hash_password(user_dict["password"])
    result = users_collection.insert_one(user_dict)
    user_in_db = UserInDB(**user.dict(), id=result.inserted_id)
    return user_in_db

@app.post("/token", response_model=dict)
async def login(username: str, password: str):
    user = users_collection.find_one({"username": username})
    if user and verify_password(password, user["password"]):
        return {"message": "Login successful", "access_token": f"fake-token-{username}", "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
