import getpass
import os
from dotenv import load_dotenv 
from langchain_openai import OpenAIEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore

load_dotenv()
OPENAI_API_KEY= os.environ["OPENAI_API_KEY"]

embeddings = OpenAIEmbeddings(model="text-embedding-3-large", api_key =OPENAI_API_KEY )
vector_store = InMemoryVectorStore(embeddings)
