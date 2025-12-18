//url: https://learnersbucket.com/examples/interview/implement-maplimit-async-function/
///so here , if any old browser doesnt support any new js concept , we use pollyfills

/// what does array.map do ?
const number=[1,2,3,4,5]
// const doubled=number.map(num=>num*2)
// console.log(doubled)
// it will just multiply ur number

const limit =2;




/// first here start with chopping the array 
const chopper=(size)=>{

    const temp=[...this]
    if(!size){
        return temp
    }
    
    const output=[];
    let i=0;
    while(i<temp.length){
        output.push(temp.slice(i, i+size))
        i=i+size;
    }
    return output
}
         const mapLimit= (input, limit, fn)=>{
          return new Promise((res, rej)=>{
        //// then chop it
        let chopped=input.chop(limit)
             // for all the subarrays of chopped
    // run it in series
    // that is one after another
    // initially it will take an empty array to resolve
    // merge the output of the subarray and pass it on to the next
    
        
          })
        }