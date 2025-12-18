// Input:
// console.log(chop([1,2,3,4,5,6,7,8,9,10], 3));

// Output:
// [[1,2,3], [4,5,6], [7,8,9], [10]]


const chopper=(array, size=array.length)=>{

const temp=[...array]
const output=[];
let i=0;
while(i<temp.length){
    output.push(temp.slice(i,i+size))
    i=i+size
}
return output

}


console.log(chopper([3,3,5,5,3,1,3,4,5],5))