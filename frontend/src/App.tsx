import React, { useRef, useState } from "react";
import "./App.css";

function App() {
  const [mood, setMood] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return reject(new Error("No recorder"));

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        resolve(audioBlob);
      };

      recorder.stop();
    });
  };

  const handleVoiceSubmit = async () => {
    setLoading(true);
    setAdvice("");

    try {
      const audioBlob = await stopRecording();

      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const sttRes = await fetch("http://localhost:8000/stt", {
        method: "POST",
        body: formData,
      });
      const sttData = await sttRes.json();
      const transcribedMood = sttData.response ?? "";
      setMood(transcribedMood);

      const response = await fetch("http://localhost:8000/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: transcribedMood }),
      });

      const data = await response.json();
      setAdvice(data.response ?? "");

      const responseAudio = await fetch("http://localhost:8000/coach/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.response }),
      });

      const coachAudioBlob = await responseAudio.blob();
      const audioUrl = URL.createObjectURL(coachAudioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      await audio.play();

    } catch (error) {
      console.error("Erreur:", error);
      setAdvice("Erreur de connexion au coach...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Ton Coach de Poche</h1>
      <div className="card">
        <input
          type="text"
          placeholder="Comment ça va ?"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />

        <button onClick={startRecording} disabled={loading || isRecording}>
          Commencer
        </button>
        <button onClick={handleVoiceSubmit} disabled={loading || !isRecording}>
          Stop & Envoyer
        </button>
      </div>

      {advice && (
        <div className="response-box">
          <p>“{advice}”</p>
        </div>
      )}
    </div>
  );
}

export default App;
