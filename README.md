# StudyPlan Buddy v2

A full-stack study plan management app built with React (frontend), Python Flask (backend), and Supabase (database).

## Features

- **Login Screen** – Simple email/password login
- **Create Study Plan** – Save study plans with student name, course, subject, deadline, and hours per week
- **Saved Study Plans** – Retrieve and display all saved records from Supabase
- **Confirmation** – Success message after submission

## Project Structure

```
├── backend/
│   ├── app.py              # Flask API (POST/GET /api/study-plans)
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Backend environment template
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Main app with React Router
│   │   ├── App.css         # Styling
│   │   ├── index.js        # React entry point
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── CreateStudyPlan.js
│   │   │   ├── SavedStudyPlans.js
│   │   │   └── Confirmation.js
│   │   └── services/
│   │       └── api.js      # API calls to Flask backend
│   └── package.json
├── .gitignore
└── README.md
```

## Setup Instructions

### 1. Supabase Setup

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. In the SQL Editor, run this query to create the `study_plans` table:

```sql
CREATE TABLE study_plans (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_name TEXT NOT NULL,
  course TEXT NOT NULL,
  subject TEXT NOT NULL,
  deadline DATE NOT NULL,
  hours_per_week INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Activate it (Mac/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
copy .env.example .env
# Then edit .env with your Supabase URL and anon key

# Run the Flask server
python app.py
```

The API will run at `http://localhost:5000`.

### 3. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/study-plans` | Save a new study plan |
| GET | `/api/study-plans` | Retrieve all study plans |

### POST /api/study-plans

```json
{
  "student_name": "John Doe",
  "course": "BUS4012",
  "subject": "Business Strategy",
  "deadline": "2026-06-15",
  "hours_per_week": 10
}
```

## Deployment

### Vercel (Frontend)

1. Push the project to GitHub
2. Import the repository into Vercel
3. Set the Root Directory to `frontend`
4. Add environment variable: `REACT_APP_API_URL` pointing to your deployed backend URL

### Render / Railway (Backend)

1. Create a new Web Service pointing to the `backend/` directory
2. Set the start command: `gunicorn app:app`
3. Add environment variables: `SUPABASE_URL` and `SUPABASE_KEY`

## Security

- Supabase credentials are stored in environment variables (`.env` files)
- `.env` files are excluded from version control via `.gitignore`
- The frontend only communicates with the backend API – no direct Supabase calls from the browser