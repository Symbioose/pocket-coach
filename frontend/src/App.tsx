import { useState } from 'react'
import './App.css'

function App() {
  const [mood, setMood] = useState("") 
  const [advice, setAdvice] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true);
    setAdvice("");
    
    try {
      const response = await fetch('http://localhost:8000/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: mood })
      });
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl); 
      audio.play()
    } catch (error) {
      console.error("Erreur:", error);
      setAdvice("Erreur de connexion au coach...");
    }
    
    setLoading(false);
  }

  return (
    <div className="container">
      <h1>🥊 Ton Coach de Poche Personel</h1>
      <div className="card">
        <input 
          type="text" 
          placeholder="Comment ça va ?" 
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Réflexion..." : "Motive-moi"}
        </button>
      </div>
      
      {advice && (
        <div className="response-box">
          <p>“”</p>
        </div>
      )}
    </div>
  )
}

export default App