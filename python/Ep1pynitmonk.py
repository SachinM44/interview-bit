# so here here python vars dont hold the value its holds the refs


a = 10
b = a
a = 5

print(b)

# the output will be 10 , not the 5 , becouse it got compiled and stored the ref of in 2nd line since python is the compiled lang


# but if u see this then
a = [1, 2, 4]  # this is the list
b = a

b.append(4)
print(a)
# output will be 1,2,3,4 , why, bcz this is mutable where the above float , int ,str are immutable where list, dict , array , objects are


# reassinment
a = [3.5, 6, 7]
a = b
b = [910]

print(b)
# it gives the 910 only becouse its reassining u are not appening


# so what would be the ans here


state = {"message": []}  # its an emply dict where messay key holds nothing as  value

node_a_view = state
node_a_view = state["message"].append("hi")
print(state["message"])


# so the asn will be hi , this is happneds we shared the same mutable state arrocoss diff steps where it carries the same ref with each line compilation
# so immutables are , int , fload , bool , tuple , freozenset , bytes
# and mutale is dict , set, bytearray
# also in mutable , values gets updated but the ref , but they are in immutable, opposite
# alos list means array in py where dict is object or json


# famous qns


def add(x, bucket=[]):
    bucket.append(x)  # so u just adding into the bucket as next item ,
    return bucket


print(add(1))
print(add(12))

# output will be [1,2]
