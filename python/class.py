#now the classes in the python 
# so class is an object created duign the class declaration, so bescall u created the class and means u declaring the object 
# and the sachin is the  beject which has the blueprint and the my_sachin( ) will be the another aboject which taked the blueprint and so that u wont repeat the code n number of times 


class Sachin: 
    def __init__(self , name, age , goal):
        self.name= name 
        self.age=age
        self.goal=goal

    def Drive(self):
     print(' im driving the car here ')
    
    def his_age_next_yr(self):
        return self.age + 144

# so its below line creatign the instance of that class using or invokign thatt class 
sachin_1= Sachin("name", 10, "eat")
print(sachin_1.age)
print(sachin_1.his_age_next_yr()) 




# so here Sachin is the class name 
# name age are the attributes
# self is the reference to the current object , like this 
#__init() is the constructor 
#drive is the method 