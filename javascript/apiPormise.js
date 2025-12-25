

////genarate mock api data withou api endpoint using the promise 

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


apiResponse.then((result)=>{
   console.log(result)
}).catch((err)=>{
    console.log(err)
})