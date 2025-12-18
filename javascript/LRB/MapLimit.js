//url: https://learnersbucket.com/examples/interview/implement-maplimit-async-function/
///so here , if any old browser doesnt support any new js concept , we use pollyfills

/// what does array.map do ?
const number=[1,2,3,4,5]
// const doubled=number.map(num=>num*2)
// console.log(doubled)
// it will just multiply ur number



const mapLimit= async ()=>{
  return new Promise((res, rej)=>{
   number.map(num=> num * 4)
  })
}