from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from video_transcript import get_transcript
from embedding import create_vector_store

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

vector_store = None
model = ChatOpenAI(model="gpt-4", api_key=OPENAI_API_KEY)

class LoadVideoRequest(BaseModel):
    url: str

class AskRequest(BaseModel):
    question: str

@app.post("/load-video")
async def load_video(request: LoadVideoRequest):
    global vector_store
    
    try:
        # get transcript from youtube captions
        text = get_transcript(request.url)
    
        # create vector store with embeddings
        vector_store, chunk_count = create_vector_store(text)
        
        return {"message": f"video loaded successfully! Indexed {chunk_count} chunks."}
    except Exception as e:
        return {"message": f"error loading video: {str(e)}", "error": True}

@app.post("/ask")
async def ask_question(request: AskRequest):
    global vector_store
    
    if vector_store is None:
        return {"answer": "Please load a video first!"}
    
    try:
        # retrieve relevant context
        retrieved_docs = vector_store.similarity_search(request.question, k=3)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])
        
        # generate answer using LLM
        prompt = f"""Based on the following context from a YouTube video, answer the question.

Context:
{context}

Question: {request.question}

Answer:"""
        
        response = model.invoke(prompt)
        
        return {"answer": response.content}
    except Exception as e:
        return {"answer": f"Error processing question: {str(e)}"}

@app.get("/")
async def root():
    return {"message": "YouTube RAG Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)