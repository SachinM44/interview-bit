
from dotenv import load_dotenv
import time # the time 
print(load_dotenv())

from google import genai

client = genai.Client()

# #start_time = time.perf_counter() # so this is the fn which we use for the performace counting likle that 
# # interaction = client.interactions.create(
# #     model="gemini-3.5-flash",
# #     input="Explain how AI works in a few words"
# # )

# end_time= time.perf_counter()


def cook_food(ingredient, cusine, diet):
    prompt= f'''
      first sing me a song in kannada short and 2 lines in english and 2 lines in kannada 
     '''
    interaction = client.interactions.create(
         model="gemini-3.5-flash",
         input=prompt 
    )
    print(interaction.output_text)
    return interaction.output_text




cook_food(["tomato" , "onion"], "indian", "veg")


# print(f"time taken by api gemini is {end_time-start_time} seconds")
x=1
if(x>5):
  print(x)