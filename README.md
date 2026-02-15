# Pocket Coach

Real-time vocal AI coach built with:
- STT (Groq Whisper)
- Coach response generation (Mistral)
- TTS (ElevenLabs)

## Goal
Build a simple but solid voice AI app to learn modern AI product engineering

## Tech Stack
- Frontend: React + Vite + TypeScript
- Backend: FastAPI (Python)
- AI services: Groq, Mistral, ElevenLabs
- Infra: Docker Compose

## Voice Flow
1. Frontend records microphone audio.
2. `POST /stt` transcribes audio to text.
3. `POST /coach` generates the coach message.
4. `POST /coach/audio` converts this text to speech.
5. Frontend plays the returned audio.

## Run Locally

### 1. Prerequisites
- Docker installed and running

### 2. Configure environment variables
Create `.env` at repo root (same level as `docker-compose.yml`):

```env
MISTRAL_API_KEY=your_mistral_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
GROQ_API_KEY=your_groq_api_key
```

### 3. Build and start
```bash
docker compose up --build
```

### 4. Access
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

### 5. Stop
```bash
docker compose down
```

## API Endpoints
- `POST /stt`
  - Content-Type: `multipart/form-data`
  - Field: `file`
  - Returns: `{ "response": "transcribed text" }`

- `POST /coach`
  - Body: `{ "mood": "..." }`
  - Returns: `{ "response": "coach sentence" }`

- `POST /coach/audio`
  - Body: `{ "text": "..." }`
  - Returns: `audio/mpeg` stream
