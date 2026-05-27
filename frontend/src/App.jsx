import { useState } from "react";


export default function App() {
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  async function loadVideo() {
    const res = await fetch(`http://127.0.0.1:500/load`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (res.ok) setLoaded(true);
  }

  async function sendQuestion() {
    const res = await fetch(`http://127.0.0.1:500/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, question }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { q: question, a: data.answer }]);
    setQuestion("");
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
      <h1>YouTube Chat</h1>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste YouTube URL" />
      <button onClick={loadVideo}>Load Video</button>

      {loaded && (
        <>
          {messages.map((m, i) => (
            <div key={i}>
              <p><strong>You:</strong> {m.q}</p>
              <p><strong>AI:</strong> {m.a}</p>
            </div>
          ))}
          <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about the video" />
          <button onClick={sendQuestion}>Send</button>
        </>
      )}
    </div>
  );
}