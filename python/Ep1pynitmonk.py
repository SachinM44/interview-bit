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
