from fastapi import FastAPI

app=FastAPI()

@app.get("/")
async def root():
    return {
      "msg": "hello world"
    }


#now create the path for query params, , like query params like items/45, or emplyee/sachin like that 
#In FastAPI, the brackets in your route definition create the capture:

@app.get("/items/{item_id}")
async def get_item(item_id):
    return {
        "item_id" : item_id
    }

#the output : {"item_id":"33a"}

#so now add the type for that param 

@app.get("/ids/{id_no}")
async def get_number(id_no: int):
    return {
        "id_no" : id_no
    }


#then the output will be like if u dont sent the number or int only 
#{"detail":[{"type":"int_parsing","loc":["path","id_no"],"msg":"Input should be a valid integer, unable to parse string as an integer","input":"33a"}]}