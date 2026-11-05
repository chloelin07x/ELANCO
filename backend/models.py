from sqlalchemy import Column, String, Date
from database import Base

class Sightings(Base):
    __tablename__ = "sightings"

    id         = Column(String, primary_key=True)
    date       = Column(Date, nullable=False)
    location   = Column(String, nullable=False)
    species    = Column(String, nullable=False)
    latin_name = Column(String, nullable=False)



