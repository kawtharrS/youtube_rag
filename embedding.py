import getpass
import os
from dotenv import load_dotenv 
from langchain_openai import OpenAIEmbeddings

load_dotenv()
OPENAI_API_KEY= os.environ["OPENAI_API_KEY"]

embeddings = OpenAIEmbeddings(model="text-embedding-3-large", api_key =OPENAI_API_KEY )