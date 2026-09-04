
from dotenv import load_dotenv
import time
print(load_dotenv())

from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-3.5-flash",
    input="Explain how AI works in a few words"
)


print(interaction.output.text)