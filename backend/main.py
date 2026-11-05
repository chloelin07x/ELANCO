from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel
from datetime import date
import uuid

import database
import models

app = FastAPI()

origins = [
  "http://localhost:5173"
  ]

app.add_middleware(CORSMiddleware,
                   allow_origins=origins, 
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])

# Create the tables in Postgres if they don't exist yet
models.Base.metadata.create_all(bind=database.engine)

# Pydantic Schema
class SightingCreate(BaseModel):
    date: date
    location: str
    species: str
    latin_name: str

# FastAPI Create Endpoint
@app.post("/")
async def create_sighting(sighting: SightingCreate, 
                          db: Session = Depends(database.get_db)):
    
    # Generate a unique ID for the new row
    new_id = str(uuid.uuid4())
    
    # Create the database object
    db_sighting = models.Sightings(
        id=new_id,
        date=sighting.date,
        location=sighting.location,
        species=sighting.species,
        latin_name=sighting.latin_name
    )
    
    # Save it to Postgres
    db.add(db_sighting)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Something went wrong during reporting")
    
    return {"message": "Sighting reported successfully", "id": new_id}