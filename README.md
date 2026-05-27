# YouTube Chat (Frontend + Backend)

Ask questions about a YouTube video using its transcript.

The app has:
- **Frontend**: React + Vite UI
- **Backend**: Flask API that fetches transcript, builds embeddings with Gemini, stores vectors in FAISS, and answers with Groq LLM

---

## Project Structure

```text
YouTube_Chat/
  backend/
    app.py
    requirements.txt
  frontend/
    src/
    package.json
```

---

## Prerequisites

Install the following first:
- Python 3.10+
- Node.js 18+
- npm

API keys needed:
- `GOOGLE_API_KEY`
- `GROQ_API_KEY`

---

## Backend Setup (Flask)

1. Open a terminal in `backend/`.
2. Create and activate a virtual environment.
3. Install dependencies.
4. Create a `.env` file.
5. Run the Flask server.

### Windows PowerShell

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GOOGLE_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key
```

Run backend:

```powershell
python app.py
```

Backend runs on:
- `http://127.0.0.1:5000`

Available endpoints:
- `POST /load` with JSON body: `{ "url": "<youtube_url>" }`
- `POST /chat` with JSON body: `{ "url": "<youtube_url>", "question": "..." }`

---

## Frontend Setup (React + Vite)

1. Open another terminal in `frontend/`.
2. Install dependencies.
3. Start the dev server.

```powershell
cd frontend
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`).

Note:
- The frontend currently calls backend URLs directly at:
  - `http://127.0.0.1:5000/load`
  - `http://127.0.0.1:5000/chat`

---

## How to Use

1. Start backend server.
2. Start frontend dev server.
3. Open the frontend in browser.
4. Paste a YouTube URL and click **Load Video**.
5. Ask questions in the chat box.

---

## Troubleshooting

- If transcript fetch fails, verify the YouTube URL is valid and has transcripts available.
- If you get API/auth errors, check your `.env` keys.
- If CORS or connection issues occur, confirm backend is running on port `5000`.
- If `faiss-cpu` installation fails, use a compatible Python version (3.10/3.11 is usually safest).

---

## Production Notes

- `gunicorn` is included in backend dependencies and can be used for deployment.
- For production, avoid hardcoding backend URLs in frontend; use environment variables instead.
