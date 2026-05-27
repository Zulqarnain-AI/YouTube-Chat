import { useState, useRef, useEffect } from "react";

const YT_RED = "#FF0000";
const YT_RED_DIM = "#CC0000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root {
    background: #0a0a0a;
    color: #e8e8e8;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }

  .app-shell {
    max-width: 820px;
    margin: 0 auto;
    padding: 0 1.5rem 2rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 2rem 0 2.5rem;
  }
  .logo-dot {
    width: 36px; height: 36px;
    background: ${YT_RED};
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 24px rgba(255,0,0,0.35);
  }
  .logo-dot svg { width: 18px; height: 18px; fill: white; }
  .header-text h1 {
    font-size: 20px; font-weight: 600; letter-spacing: -0.4px; color: #f0f0f0;
  }
  .header-text p {
    font-size: 13px; color: #555; margin-top: 1px;
  }

  /* ── URL Card ── */
  .url-card {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
    transition: border-color 0.2s;
  }
  .url-card:focus-within { border-color: #2a2a2a; }

  .url-label {
    font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
    color: #444; font-weight: 500; margin-bottom: 10px;
  }
  .url-row {
    display: flex; gap: 10px; align-items: center;
  }
  .url-input {
    flex: 1;
    background: #0a0a0a;
    border: 1px solid #1e1e1e;
    border-radius: 10px;
    color: #e8e8e8;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .url-input::placeholder { color: #333; }
  .url-input:focus {
    border-color: #2d2d2d;
    box-shadow: 0 0 0 3px rgba(255,0,0,0.06);
  }

  .btn-load {
    background: ${YT_RED};
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; gap: 7px;
    white-space: nowrap;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    box-shadow: 0 0 20px rgba(255,0,0,0.2);
  }
  .btn-load:hover { background: ${YT_RED_DIM}; box-shadow: 0 0 28px rgba(255,0,0,0.35); }
  .btn-load:active { transform: scale(0.97); }
  .btn-load:disabled { background: #1f1f1f; color: #444; box-shadow: none; cursor: not-allowed; }
  .btn-load svg { width: 14px; height: 14px; }

  /* ── Video Preview ── */
  .video-preview {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 14px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 14px;
    animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .video-thumb {
    width: 80px; height: 54px;
    border-radius: 8px;
    background: #1a1a1a;
    overflow: hidden;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .video-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .video-thumb .play-icon { color: #333; }
  .video-meta { flex: 1; min-width: 0; }
  .video-status {
    font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
    color: #3a9e5f; font-weight: 600; margin-bottom: 4px;
    display: flex; align-items: center; gap: 5px;
  }
  .status-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #3a9e5f;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .video-url {
    font-family: 'DM Mono', monospace;
    font-size: 12px; color: #444;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* ── Chat area ── */
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .chat-scroll {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 1.25rem;
    padding-right: 4px;
  }

  /* ── Message bubbles ── */
  .msg-group { animation: fadeUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .msg-user {
    display: flex; justify-content: flex-end;
    margin: 0.6rem 0 0.25rem;
  }
  .bubble-user {
    background: #1c1c1c;
    border: 1px solid #252525;
    border-radius: 14px 14px 4px 14px;
    padding: 10px 16px;
    max-width: 70%;
    font-size: 14px; line-height: 1.55; color: #d8d8d8;
  }

  .msg-ai { margin: 0.25rem 0 1.25rem; }
  .ai-header {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 10px;
  }
  .ai-avatar {
    width: 26px; height: 26px; border-radius: 8px;
    background: ${YT_RED};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 12px rgba(255,0,0,0.25);
  }
  .ai-avatar svg { width: 12px; height: 12px; fill: white; }
  .ai-name { font-size: 12px; color: #444; font-weight: 500; }

  .bubble-ai {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 4px 14px 14px 14px;
    padding: 1rem 1.25rem;
    font-size: 14px; line-height: 1.7; color: #ccc;
  }

  /* ── Structured AI output ── */
  .ai-section { margin-bottom: 1rem; }
  .ai-section:last-child { margin-bottom: 0; }

  .ai-heading {
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: #FF0000; font-weight: 600; margin-bottom: 6px;
    opacity: 0.8;
  }

  .ai-para { color: #bbb; font-size: 14px; line-height: 1.75; }

  .ai-list {
    list-style: none; padding: 0;
    display: flex; flex-direction: column; gap: 5px;
  }
  .ai-list li {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 14px; color: #bbb; line-height: 1.6;
  }
  .ai-list li::before {
    content: '';
    width: 4px; height: 4px; border-radius: 50%;
    background: ${YT_RED}; margin-top: 9px; flex-shrink: 0; opacity: 0.7;
  }

  .ai-divider {
    height: 1px; background: #1e1e1e; margin: 0.75rem 0;
  }

  .ai-quote {
    border-left: 2px solid ${YT_RED};
    padding: 6px 12px;
    background: rgba(255,0,0,0.04);
    border-radius: 0 6px 6px 0;
    font-size: 13px; color: #888; font-style: italic;
    margin: 4px 0;
  }

  .ai-highlight {
    display: inline-block;
    background: rgba(255,0,0,0.08);
    color: #ff6b6b; font-family: 'DM Mono', monospace;
    font-size: 12px; padding: 1px 6px; border-radius: 4px;
  }

  /* ── Typing indicator ── */
  .typing-wrap { margin: 0.25rem 0 1.25rem; }
  .typing-bubble {
    background: #111; border: 1px solid #1e1e1e;
    border-radius: 4px 14px 14px 14px;
    padding: 12px 16px; display: inline-flex;
    align-items: center; gap: 5px;
  }
  .dot {
    width: 5px; height: 5px; border-radius: 50%; background: #333;
    animation: bounce 1.2s infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); background: #333; }
    30% { transform: translateY(-5px); background: ${YT_RED}; }
  }

  /* ── Empty state ── */
  .empty-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 3rem 0; gap: 12px; text-align: center;
  }
  .empty-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: #111; border: 1px solid #1e1e1e;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .empty-icon svg { width: 24px; height: 24px; opacity: 0.25; }
  .empty-title { font-size: 15px; font-weight: 500; color: #333; }
  .empty-sub { font-size: 13px; color: #2a2a2a; max-width: 280px; line-height: 1.6; }

  /* ── Suggestions ── */
  .suggestions {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-bottom: 1.25rem;
  }
  .suggestion-chip {
    background: #111; border: 1px solid #1e1e1e;
    border-radius: 20px; padding: 6px 14px;
    font-size: 12px; color: #444; cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .suggestion-chip:hover { border-color: #2d2d2d; color: #888; }

  /* ── Input row ── */
  .input-card {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 16px;
    padding: 0.875rem 1rem;
    display: flex; align-items: flex-end; gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-card:focus-within {
    border-color: #2a2a2a;
    box-shadow: 0 0 0 3px rgba(255,0,0,0.05);
  }
  .question-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: #e0e0e0; font-family: 'DM Sans', sans-serif;
    font-size: 14px; line-height: 1.5; resize: none;
    min-height: 22px; max-height: 120px;
    overflow-y: auto;
  }
  .question-input::placeholder { color: #2e2e2e; }

  .btn-send {
    width: 36px; height: 36px; border-radius: 10px;
    background: ${YT_RED};
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    box-shadow: 0 0 16px rgba(255,0,0,0.2);
  }
  .btn-send:hover { background: ${YT_RED_DIM}; box-shadow: 0 0 22px rgba(255,0,0,0.3); }
  .btn-send:active { transform: scale(0.94); }
  .btn-send:disabled { background: #1a1a1a; box-shadow: none; cursor: not-allowed; }
  .btn-send svg { width: 15px; height: 15px; fill: white; }

  .char-hint { font-size: 11px; color: #2a2a2a; padding: 2px 0 0; white-space: nowrap; }

  /* ── Loading ── */
  .spinner {
    width: 12px; height: 12px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: #1a1a1a; border: 1px solid #ff4444;
    border-radius: 10px; padding: 10px 18px;
    font-size: 13px; color: #ff6b6b;
    animation: toastLife 3.2s ease forwards;
    z-index: 999;
    pointer-events: none;
  }
  @keyframes toastLife {
    0%   { opacity: 0; transform: translateX(-50%) translateY(8px); }
    8%   { opacity: 1; transform: translateX(-50%) translateY(0); }
    80%  { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(4px); }
  }
`;

/* ── Parse AI text into structured sections ── */
function parseAIResponse(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const sections = [];
  let current = { type: "para", content: [] };

  for (const line of lines) {
    if (/^#{1,3}\s/.test(line)) {
      if (current.content.length) sections.push({ ...current });
      sections.push({ type: "heading", content: line.replace(/^#{1,3}\s/, "") });
      current = { type: "para", content: [] };
    } else if (/^[-•*]\s/.test(line)) {
      if (current.type !== "list") {
        if (current.content.length) sections.push({ ...current });
        current = { type: "list", content: [] };
      }
      current.content.push(line.replace(/^[-•*]\s/, ""));
    } else if (/^\d+\.\s/.test(line)) {
      if (current.type !== "list") {
        if (current.content.length) sections.push({ ...current });
        current = { type: "list", content: [] };
      }
      current.content.push(line.replace(/^\d+\.\s/, ""));
    } else if (line.startsWith(">")) {
      if (current.content.length) sections.push({ ...current });
      sections.push({ type: "quote", content: line.slice(1).trim() });
      current = { type: "para", content: [] };
    } else if (line === "---" || line === "***") {
      if (current.content.length) sections.push({ ...current });
      sections.push({ type: "divider" });
      current = { type: "para", content: [] };
    } else {
      if (current.type !== "para") {
        if (current.content.length) sections.push({ ...current });
        current = { type: "para", content: [] };
      }
      current.content.push(line);
    }
  }
  if (current.content?.length) sections.push(current);
  if (!sections.length) sections.push({ type: "para", content: [text] });
  return sections;
}

function inlineFormat(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`"))
      return <span key={i} className="ai-highlight">{p.slice(1, -1)}</span>;
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} style={{ color: "#ddd", fontWeight: 500 }}>{p.slice(2, -2)}</strong>;
    return p;
  });
}

function StructuredAnswer({ text }) {
  const sections = parseAIResponse(text);
  return (
    <div className="bubble-ai">
      {sections.map((s, i) => {
        if (s.type === "heading") return (
          <div key={i} className="ai-section">
            <div className="ai-heading">{s.content}</div>
          </div>
        );
        if (s.type === "para") return (
          <div key={i} className="ai-section">
            {s.content.map((line, j) => (
              <p key={j} className="ai-para">{inlineFormat(line)}</p>
            ))}
          </div>
        );
        if (s.type === "list") return (
          <div key={i} className="ai-section">
            <ul className="ai-list">
              {s.content.map((item, j) => (
                <li key={j}>{inlineFormat(item)}</li>
              ))}
            </ul>
          </div>
        );
        if (s.type === "quote") return (
          <div key={i} className="ai-section">
            <div className="ai-quote">{s.content}</div>
          </div>
        );
        if (s.type === "divider") return (
          <div key={i} className="ai-divider" />
        );
        return null;
      })}
    </div>
  );
}

const SUGGESTIONS = [
  "Summarize this video",
  "What are the main points?",
  "Any key timestamps?",
  "Who is the speaker?",
];

function extractVideoId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const videoId = extractVideoId(url);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  function showToast(msg) {
    setToast(msg);
  }

  async function loadVideo() {
    if (!url.trim()) return showToast("Please paste a YouTube URL");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:500/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setLoaded(true);
        setMessages([]);
      } else {
        showToast("Failed to load video — check the URL");
      }
    } catch {
      showToast("Server unreachable — is your backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function sendQuestion(q) {
    const text = (q || question).trim();
    if (!text || sending) return;
    setMessages(prev => [...prev, { q: text, a: null }]);
    setQuestion("");
    setSending(true);
    try {
      const res = await fetch("http://127.0.0.1:500/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, question: text }),
      });
      const data = await res.json();
      setMessages(prev =>
        prev.map((m, i) => i === prev.length - 1 ? { ...m, a: data.answer } : m)
      );
    } catch {
      setMessages(prev =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, a: "Sorry, I couldn't reach the server. Please try again." }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  }

  function handleTextarea(e) {
    setQuestion(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">

        {/* Header */}
        <div className="header">
          <div className="logo-dot">
            <svg viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
          </div>
          <div className="header-text">
            <h1>YouTube Chat</h1>
            <p>Ask anything about any video</p>
          </div>
        </div>

        {/* URL input */}
        <div className="url-card">
          <div className="url-label">Video URL</div>
          <div className="url-row">
            <input
              className="url-input"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && loadVideo()}
              placeholder="https://youtube.com/watch?v=..."
              spellCheck={false}
            />
            <button className="btn-load" onClick={loadVideo} disabled={loading || !url.trim()}>
              {loading
                ? <><span className="spinner" /> Loading</>
                : <>
                    <svg viewBox="0 0 24 24"><path d="M4 4h16v2H4zm0 6h16v2H4zm0 6h16v2H4z" /></svg>
                    Load
                  </>
              }
            </button>
          </div>
        </div>

        {/* Video loaded state */}
        {loaded && (
          <div className="video-preview">
            <div className="video-thumb">
              {videoId
                ? <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt="thumb" />
                : <span className="play-icon">▶</span>
              }
            </div>
            <div className="video-meta">
              <div className="video-status">
                <span className="status-dot" />
                Ready to chat
              </div>
              <div className="video-url">{url}</div>
            </div>
          </div>
        )}

        {/* Chat */}
        {loaded && (
          <div className="chat-area">
            <div className="chat-scroll">
              {messages.length === 0 && !sending ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="empty-title">Ask about the video</div>
                  <div className="empty-sub">Get summaries, key points, quotes, timestamps, and more</div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className="msg-group">
                    <div className="msg-user">
                      <div className="bubble-user">{m.q}</div>
                    </div>
                    {m.a === null ? (
                      <div className="typing-wrap">
                        <div className="ai-header">
                          <div className="ai-avatar">
                            <svg viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
                          </div>
                          <span className="ai-name">AI</span>
                        </div>
                        <div className="typing-bubble">
                          <div className="dot" /><div className="dot" /><div className="dot" />
                        </div>
                      </div>
                    ) : (
                      <div className="msg-ai">
                        <div className="ai-header">
                          <div className="ai-avatar">
                            <svg viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
                          </div>
                          <span className="ai-name">AI</span>
                        </div>
                        <StructuredAnswer text={m.a} />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestion chips (only before first message) */}
            {messages.length === 0 && (
              <div className="suggestions">
                {SUGGESTIONS.map(s => (
                  <button key={s} className="suggestion-chip" onClick={() => sendQuestion(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="input-card">
              <textarea
                ref={textareaRef}
                className="question-input"
                value={question}
                onChange={handleTextarea}
                onKeyDown={handleKey}
                placeholder="Ask about the video…"
                rows={1}
                disabled={sending}
              />
              <button
                className="btn-send"
                onClick={() => sendQuestion()}
                disabled={!question.trim() || sending}
                aria-label="Send"
              >
                {sending
                  ? <span className="spinner" />
                  : <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                }
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast" onAnimationEnd={() => setToast(null)}>{toast}</div>
      )}
    </>
  );
}