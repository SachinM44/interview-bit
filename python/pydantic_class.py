# so class are best , if u want data vlaidation and all for that class , like what data is exapect whand what data it should give so that usee can use the pydantic at that time 


from pydantic import BaseModel 

class User(BaseModel):
    name: str 
    age: int 


user =User(name="sachin", age=10)


print(user.name)
print(user.age)


# so it basically vlaidete the data tupes 