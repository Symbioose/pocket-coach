import os
from fastapi import FastAPI
from pydantic import BaseModel
from mistralai import Mistral
from fastapi.middleware.cors import CORSMiddleware

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


class MoodRequest(BaseModel):
    mood: str


@app.post("/coach")
def get_motivation(request: MoodRequest):
    messages = [
        {
            "role": "system",
            "content": "Tu es un coach stoicien. Repond en une phrase percutante en lien avec mon humeur.",
        },
        {"role": "user", "content": f"Mon humeur : {request.mood}"},
    ]

    if not mistral_api_key:
        return {"response": "Merci de renseigner une key api mistral"}

    chat_response = client.chat.complete(model="mistral-tiny", messages=messages)
    return {"response": chat_response.choices[0].message.content}
