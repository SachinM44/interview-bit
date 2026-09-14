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

#so now the multiple params 

@app.get("/users/{user_id}/items/{item_id}")
async def get_name_and_item_id(user_id:int, item_id:int):
    return {
        "user_id": user_id,
        "item_id":item_id
    }



# now the imp one which is query params 
# so query parasms are like u quessry using ? 
# app.get('/items', (req, res) => {
#   const skip = req.query.skip;  // "0" (string)
#   const limit = req.query.limit; // "10" (string)
#   res.json({ skip, limit });
# }); in expresst , so that it can skipt that much , so write that in pythin 



@app.get("/veggies")
async def query_params(skip:int=0, limit:int=20):
    return {
   "skip" : skip, 
   "limit" : limit
}


# so the route will be this : http://localhost:8000/veggies?skip=5&limit=10
# and the output like this 

# {"skip":5,"limit":10}, so that means its askiied top 5 in in under the limit of 10 


#what if th equery prama would be the optinla 

@app.get("/optional")
async def optional_query_params( q : str | None):
    return {
        "q" : q
    }
