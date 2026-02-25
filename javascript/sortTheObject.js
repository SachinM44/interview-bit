// Group objects by property.

const obj=[
{type: "fruit", name: "apple"},
{type: "veg", name: "carrot"},
{type: "fruit", name: "banana"}
]

// Output:
// {
// fruit: [...],
// veg: [...]
// }

const sortTheObject = (obj) => {
  const result = [];
  for(let i=0; i < obj.length; i++){
    if(!result[obj.type]){
           obj[i]=[]
            result.push()
    }
  }
  return result;
};


const sortob=sortTheObject(obj)
console.log(sortob)
