#data types and all is done , next gow with the dict and touples 

# so the the dictionaly is nothing but the object 


User = {
    "name" : "sachin",
     "age" : 21 
}

# how to access the value 2 ways 
print(User['name'])
print(User.get('age'))

# add or update that thing

User['name']= "belgur"
print(User['name'])

#del User['age']
print(User.get('age'))

#sachin
#21
#belgur
#None

for key, value  in User.items(): # so this items() is the dict method in the pythoo  
    print(key , value)

