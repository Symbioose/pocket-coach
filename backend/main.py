import os
from fastapi import FastAPI
from pydantic import BaseModel
from mistralai import Mistral
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from elevenlabs.client import ElevenLabs

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


mistral_api_key = os.environ.get("MISTRAL_API_KEY", None)
client = Mistral(mistral_api_key)

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)


class MoodRequest(BaseModel):
    mood: str


class TextToAudio(BaseModel):
    text: str


@app.post("/coach")
def get_motivation_text(request: MoodRequest):
    messages = [
        {
            "role": "system",
            "content": "Tu es un coach stoicien. Repond en une phrase percutante en lien avec mon humeur afin de remonter le moral de la personne qui te parles.",
        },
        {"role": "user", "content": f"Mon humeur : {request.mood}"},
    ]

    if not mistral_api_key:
        return {"response": "Merci de renseigner une key api mistral"}

    chat_response = client.chat.complete(model="mistral-tiny", messages=messages)
    return {"response": chat_response.choices[0].message.content}


@app.post("/coach/audio")
def get_motivation_audio(request: TextToAudio):
    audio_stream = elevenlabs.text_to_speech.convert(
        text=request.text,
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )
    return StreamingResponse(
        audio_stream,
        media_type="audio/mpeg",
    )
