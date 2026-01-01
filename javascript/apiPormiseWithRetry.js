

////genarate mock api data withou api endpoint using the promise 

const { useEffect } = require("react")

const apiResponse=new Promise((res,rej)=>{
   /// api response alwaay resturns the promise the js object or json 

   const apiData={
    name:'name',
    age:29,
    city:'bls'
   }
const statusCode=2003

if(statusCode==200){
    res(apiData)
}else{
    rej("somthing went wrong")
}

})




const retry=(callback, retries,delay)=>{
   let lastCall=0;
   let count=0;
   return (...args)=>{
      if(count>=retries) return;
       const now=Date.now();
      if(now-lastCall>=delay){
        lastCall=now;
        count++;
        callback(...args)
      }

   }
}

const retryLogic=retry(()=>{
  apiResponse.then((result)=>{
   console.log(result)
}).catch((err)=>{
    console.log(err)
})
},2,1000)
retryLogic()

function xgs(){

}

console.log(typeof(xgs))
