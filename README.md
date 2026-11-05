# ELANCO

A web app for viewing and reporting tick sightings across UK cities. Sightings from the Elanco API are plotted on an interactive map, filterable by date range and species, with a sidebar showing the risk level for the selected city. Users can also submit their own sightings, which are stored in a local PostgreSQL database through a FastAPI backend.

## Tech Stack

| Layer    | Technology                                           |
| -------- | ---------------------------------------------------- |
| Frontend | React, Vite, React Router, Tailwind CSS, Leaflet     |
| Backend  | Python, FastAPI, SQLAlchemy                          |
| Database | PostgreSQL                                           |

## Project Structure

```
tickwatch/
├── backend/
│   ├── main.py          # FastAPI app and POST endpoint
│   ├── models.py        # SQLAlchemy models
│   ├── database.py      # DB engine and session setup
│   └── .env             # DATABASE_URL (not committed)
└── frontend/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── pages/home.jsx
        ├── components/  # TickMarker.jsx, ReportModal.jsx
        ├── services/    # api.js, home.js
        └── data/        # cityCoords.js, latinNames.js
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes `npm`)
- [Python](https://www.python.org/downloads/) 3.9 or newer
- [PostgreSQL](https://www.postgresql.org/download/) 13 or newer, running locally
- An internet connection (the app fetches sightings from the Elanco API and map tiles from OpenStreetMap)

See `SETUP.txt` for the full dependency list and database setup.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd tickwatch
```

### 2. Set up the database

Create the database (see `SETUP.txt` for details):

```bash
psql -U postgres -c "CREATE DATABASE elanco;"
```

Then create `backend/.env` containing:

```
DATABASE_URL=postgresql+psycopg2://<user>:<password>@localhost/elanco
```

### 3. Start the backend

```bash
cd backend
python -m venv venv

# macOS / Linux
source venv/bin/activate
# Windows (PowerShell)
venv\Scripts\Activate.ps1

pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary python-dotenv
uvicorn main:app --reload
```

The API runs at http://127.0.0.1:8000 (interactive docs at http://127.0.0.1:8000/docs). The `sightings` table is created automatically on first start.

### 4. Start the frontend

Open a **second** terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173.

> Both servers must be running at the same time. The backend only allows requests from `http://localhost:5173`, so use that address rather than `127.0.0.1:5173`.

## Usage

- **Map:** click a city marker to see its sighting count and risk level in the sidebar.
- **Filters:** narrow the map by date range or species.
- **Report:** click **Report**, fill in the date, location and species, then submit to save a sighting to the database.

## API Endpoints (backend)

| Method | Path | Description                                   |
| ------ | ---- | --------------------------------------------- |
| POST   | `/`  | Create a sighting (`date`, `location`, `species`, `latin_name`) |

## Troubleshooting

| Problem | Likely cause / fix |
| ------- | ------------------ |
| `password authentication failed` | The username or password in `DATABASE_URL` doesn't match your Postgres user. |
| `database "elanco" does not exist` | Run the `CREATE DATABASE` command in step 2. |
| `connection refused` on port 5432 | PostgreSQL isn't running. Start the service. |
| CORS error in the browser console | Open the app at `http://localhost:5173`, and make sure the backend is running. |
| Map tiles look broken or misaligned | Confirm `leaflet` is installed and `leaflet/dist/leaflet.css` is imported in `index.css`. |
| `ModuleNotFoundError` | Activate the virtual environment, then re-run the `pip install` command. |
