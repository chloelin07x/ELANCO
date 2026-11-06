# ELANCO
This is my (Chloe Lin's) submission for the Elanco Technical Task where I tried my best to create a Minimum Viable Product given the time constraints. I have attempted the Frontend technical task and these are the bullet points I aimed to hit whilst trying to design it such that it relates to Elanco's website design:

1. A dynamic map interface (imported from React Leaflet)
2. Markers for each city that ticks appear in and colour-coded severity based on number of sightings
3. Filter controls for: within a specific range and by species
4. Sidebar panel next to the map with a meaningful empty state and displays information when a marker is selected
5. Designed quick action buttons similar to Elanco's website and wired up the "Report" one
6. Left a section for the "Education Hub" to eventually be designed and expanded on
7. A form to report a sighting: asks users to input the date, tick species and location

## Tech Stack

| Layer    | Technology                                           |
| -------- | ---------------------------------------------------- |
| Frontend | React, Vite, React Router, Tailwind CSS, Leaflet     |
| Backend  | Python, FastAPI, SQLAlchemy                          |
| Database | PostgreSQL                                           |

I chose React because it has a lot of in-built components and libraries readily available that makes designing websites that display information, much simpler. The documentation is good and it is also the frontend framework I know best. I used Tailwind CSS because I find the in-line style of CSS much more intuitive than naming every single styling class in a separate document. 

I chose Python, FastAPI and SQLAlchemy for my backend because I wanted to be able to quickly design a "mock-up" backend with a simple database in PostgreSQL and a single POST endpoint. Since I have already used these in my personal project Erudite, I am most familiar with this tech stack so it was simple and easy to setup.

## Getting Started

1. Clone the repository
2. Set up (see setup.txt for more details)
3. Start the backend

```bash
cd backend
python -m venv venv
pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary python-dotenv
uvicorn main:app --reload
```

The API runs at http://127.0.0.1:8000

4. Start the frontend by opening a **second** terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173.

> Both servers must be running at the same time
