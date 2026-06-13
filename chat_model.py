import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY= os.environ["OPENAI_API_KEY"]

model = ChatOpenAI(model="gpt-5.5", api_key=OPENAI_API_KEY)

