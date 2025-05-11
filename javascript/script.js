// function home(){
//     console.log("hello from home")
// }
// console.log(typeof home)

// class myClass{

// }
// console.log(typeof myClass)
// crate a promise wich will be pending by difault and resolve it when u  button is cliked , 


const myPromise = new Promise((res,rej)=>{
    document.getElementById("btn").addEventListener("click",()=>{
        //  console.log(Promise.resolve(myPromise))
        res("value")
       });
       document.getElementById("btn2").addEventListener("click",()=>{
        //  console.log(Promise.resolve(myPromise))
        rej("got rejected")
       });

});
// myPromise.then(res=>console.log(res)).catch(err =>{console.log(err)})
//=======================================================
// can you create a promise without using a new kayword
 async function New(){
  const res= await myPromise
  return "sach"
}
 const res=await New()
console.log( res);
