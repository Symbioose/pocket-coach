import os
from groq import Groq


client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def transcribe_audio_bytes(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    transcription = client.audio.transcription.create(
        file=(filename, audio_bytes),
        model="whisper-large-v3-turbo",
        tempature=0,
        response_format="verbose_json",
    )
    return transcription.text
