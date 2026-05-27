from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi # type: ignore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS # type: ignore
from langchain_core.embeddings import Embeddings
from groq import Groq # type: ignore
from google import genai # type: ignore
from dotenv import load_dotenv # type: ignore
import re, os

load_dotenv()

app = Flask(__name__)
CORS(app)
sessions = {}

# new SDK client
google_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# ── Embeddings ───────────────────────────────────────────
class GeminiEmbeddings(Embeddings):
    def embed_documents(self, texts):
        result = []
        for text in texts:
            response = google_client.models.embed_content(
                model="gemini-embedding-001",
                contents=text
            )
            result.append(response.embeddings[0].values)
        return result

    def embed_query(self, text):
        response = google_client.models.embed_content(
            model="gemini-embedding-001",
            contents=text
        )
        return response.embeddings[0].values

# ── Transcript ───────────────────────────────────────────
def get_video_id(url):
    match = re.search(r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})", url)
    return match.group(1) if match else None

def fetch_transcript(url):
    video_id = get_video_id(url)
    if not video_id:
        raise ValueError("Invalid YouTube URL")
    ytt_api = YouTubeTranscriptApi()
    fetched = ytt_api.fetch(video_id)
    return " ".join([snippet.text for snippet in fetched])

# ── Vectorstore ──────────────────────────────────────────
def build_vectorstore(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.create_documents([text])
    return FAISS.from_documents(chunks, GeminiEmbeddings())

# ── LLM ─────────────────────────────────────────────────
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def answer_question(vectorstore, question):
    docs = vectorstore.similarity_search(question, k=4)
    context = "\n\n".join([d.page_content for d in docs])
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "Answer questions based only on the provided video transcript context."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
        ]
    )
    return response.choices[0].message.content

# ── Routes ───────────────────────────────────────────────
@app.route("/load", methods=["POST"])
def load_video():
    url = request.json.get("url")
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    try:
        print(f"[1] Fetching transcript: {url}")
        transcript = fetch_transcript(url)
        print(f"[2] Transcript: {len(transcript)} chars")
        vectorstore = build_vectorstore(transcript)
        print("[3] Vectorstore built")
        sessions[url] = vectorstore
        return jsonify({"message": "Video loaded successfully"})
    except Exception as e:
        import traceback
        print("ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["POST"])
def chat():
    url = request.json.get("url")
    question = request.json.get("question")
    vectorstore = sessions.get(url)
    if not vectorstore:
        return jsonify({"error": "Video not loaded yet"}), 400
    try:
        answer = answer_question(vectorstore, question)
        return jsonify({"answer": answer})
    except Exception as e:
        import traceback
        print("ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    
    app.run( port=500, debug=False)