



const promise=new Promise((res,rej)=>{
res(10)
})


promise.then((value)=>{
    return value+1
}).then((value)=>{
  return value+2
  
}).then((value)=> console.log(value))



//  Key difference (simple table)
// Aspect	Promise	Promise Chaining
// Purpose	Single async task	Sequence of async tasks
// Execution	One-time	Step-by-step
// Dependency	Independent	Dependent
// Result	One resolve/reject	Passed through chain