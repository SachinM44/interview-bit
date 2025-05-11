// the reducer is like applaying the function on the element s of the array and reduce in to sungle ans 
// it as current value and accumulator 
const array=[1,2,3,4,4,5,];
const addSum =array.reduce((accumualtor, currentnumber)=>{
    return accumualtor+currentnumber
})

console.log(addSum)
   // whyt to use ,, cunsise , rather than the forloop 