import os
from dotenv import load_dotenv 
from langchain_openai import OpenAIEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

def create_vector_store(text: str):
    """Create vector store from text"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,  
        chunk_overlap=200,  
        add_start_index=True, 
    )
    all_splits = text_splitter.split_text(text)
    
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large", api_key=OPENAI_API_KEY)
    vector_store = InMemoryVectorStore(embeddings)
    
    vector_store.add_texts(all_splits)
    
    return vector_store, len(all_splits)

if __name__ == "__main__":
    with open("doc.txt", "r", encoding="utf-8") as f:
        text = f.read()
    vector_store, chunk_count = create_vector_store(text)
