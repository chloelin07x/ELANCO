# ELANCO
Description here later...

## Tech Stack

| Layer    | Technology                                           |
| -------- | ---------------------------------------------------- |
| Frontend | React, Vite, React Router, Tailwind CSS, Leaflet     |
| Backend  | Python, FastAPI, SQLAlchemy                          |
| Database | PostgreSQL                                           |


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

## Usage

- **Map:** click a city marker to see its sighting count and risk level in the sidebar.
- **Filters:** narrow the map by date range or species.
- **Report:** click **Report**, fill in the date, location and species, then submit to save a sighting to the database.

