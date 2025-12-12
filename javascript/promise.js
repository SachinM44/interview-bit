// // // prosimis in the js handles the async task in js , unlike the callbacks this give the more readable and sturctured approch than the callbacks 
// // // ptomise give 3 state - pending , fullfilled , rejcted 
const data = {
    name : "sacjin ",
    age : 33,
    stay : "blr"
}

const { use } = require("react");

function fetchdata(){
    return new Promise((resolve , reject)=>{
        setTimeout(() => {
            resolve(data)
        }, 2000);
    })
}
fetchdata().then(
    data=>{
        console.log("data:" , data)
    }
).catch(err=>{
    console.log(err)
});
/////////////////////////////

// // learn promise again 
// // //how we use to write it
// // dock(()=>{
// //     document(()=>{
// //         dock(()=>{
// //             console.log(" hello word")
// //         })
// //     })
// // })

// // promise fot the above one is 
const docker=new Promise((res,rej)=>{
 let success=false
 if(success){
    res("completed")
 }else{
    rej('GO HOME')
 }
});

 console.log(docker)

// here how you can cpmplet thi in the good way as in using that then or catch
// // alway remeber to use the .then and the cath out of the promise funtion 


docker.then((msg)=>{
    console.log("what comes see ", msg)
})
docker.catch((msg)=>{
    console.log(msg, "not done")
})
 //now write promisified function
const promisifiedFunc=()=>{
    return new Promise((res, rej)=>{
        setTimeout(()=>{
            res({name:'jone'})
            rej("bla")
        },2000)
    })
} 


// ///promise chaining 
promisifiedFunc().then((user)=> console.log(user)).catch((err)=>console.log(err))


// now here how can u make them both to be executed in flow 
// sequesnce chaining chaining in this 

const func=()=>{
    return Promise.resolve({name:'sachin'}).then((user)=>{
        console.log(user)
        return { ...user, age:25}
    }).then((updateUser)=>{
        console.log("updateUser", updateUser)
        return Promise.reject("error occured while resoolveing ")
    })
}

func().then((user)=> console.log(user)).catch((error)=>console.log(error))


// Promise.all([data,docker])
//  u know what does promise.all does ? 
const p1 = new Promise(res => {
  console.log("p1 is here");
  res("p1 done");
});

const p2 = new Promise(res => {
  console.log("p2 is here");
  res("p2 done");
});

const p3 = new Promise(res => {
  console.log("p3 is here");
  res("p3 done");
});

const p4 = new Promise(res => {
  console.log("p4 is here");
  res("p4 done");
});

const p5 = new Promise((res, rej) => {
  console.log("p5 is here");
  rej("p5 failed ❌");
});

const p6 = new Promise(res => {
  console.log("p6 is here");
  res("p6 done");
});

const p7 = new Promise(res => {
  console.log("p7 is here");
  res("p7 done");
});

const p8 = new Promise(res => {
  console.log("p8 is here");
  res("p8 done");
});

Promise.all([p1,p2,p3,p4,p5,p6,p7]).then((ans)=>console.log(ans)).catch((err)=>console.log(err))

// the output will be  