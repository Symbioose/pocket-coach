Building a real time vocal AI coach.
To not be really alone during this Valentine day.

## How to run

### 1. Prerequisites
- Docker installed and running

### 2. Configure backend environment variables
Create a `.env` file at the repo root (same level as `docker-compose.yml`) and add:

```env
MISTRAL_API_KEY=your_mistral_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
GROQ_API_KEY=your_groq_api_key
```

### 3. Build and start the project

```bash
docker compose up --build
```

### 4. Open the app
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

### 5. Stop everything

```bash
docker compose down
```
