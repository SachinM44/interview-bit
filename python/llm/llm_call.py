
from dotenv import load_dotenv
import time
print(load_dotenv())

from google import genai

client = genai.Client()

start_time = time.perf_counter() # so this is the fn which we use for the performace counting likle that 
interaction = client.interactions.create(
    model="gemini-3.5-flash",
    input="Explain how AI works in a few words"
)

end_time= time.perf_counter()


print(interaction.output_text)

print(f"time taken by api gemini is {end_time-start_time} seconds")