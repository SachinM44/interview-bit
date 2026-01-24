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

// the output will be  nothing bacouse one failse everything nothing will return 


/// but u want one 
Promise.allSettled([p1,p2,p3,p4,p5,p6,p7]).then((ans)=>console.log(ans)).catch((err)=>console.log(err))


 ///if u want successfull ones 
Promise.all([p1,p2,p3,p4,p5,p6,p7]).then((ans)=>console.log(ans)).catch((err)=>console.log(err))

Perfect — let’s explain **all three** clearly with simple examples and what outputs you’ll get for p1–p8.

We’ll use these same promises:

```js
const p1 = Promise.resolve("p1 done");
const p2 = Promise.resolve("p2 done");
const p3 = Promise.resolve("p3 done");
const p4 = Promise.resolve("p4 done");
const p5 = Promise.reject("p5 failed ❌");
const p6 = Promise.resolve("p6 done");
const p7 = Promise.resolve("p7 done");
const p8 = Promise.resolve("p8 done");
```

// Now let’s explain each behavior:

// ---

// # ⭐ 1. **Promise.allSettled()**

// ### ✔ It never fails

// ### ✔ It waits for ALL promises (success + fail)

// ### Output format:

// * `{ status: "fulfilled", value: ... }`
// * `{ status: "rejected", reason: ... }`

// ### Example:

// ```js
// Promise.allSettled([p1,p2,p3,p4,p5,p6,p7,p8])
//   .then(results => console.log(results));
// ```

// ### Output:

// ```
// [
//   { status: "fulfilled", value: "p1 done" },
//   { status: "fulfilled", value: "p2 done" },
//   { status: "fulfilled", value: "p3 done" },
//   { status: "fulfilled", value: "p4 done" },
//   { status: "rejected",  reason: "p5 failed ❌" },
//   { status: "fulfilled", value: "p6 done" },
//   { status: "fulfilled", value: "p7 done" },
//   { status: "fulfilled", value: "p8 done" }
// ]
// ```

// ### Why this is useful?

// You want **all results**, even if some failed.
// Perfect for:

// * Bulk API requests
// * Batch image uploads
// * Background jobs

// ---

// # ⭐ 2. **Promise.any()**

// ### ✔ Returns the **first successful** promise

// ### ✔ Ignores all failures

// ### ❌ Rejects ONLY if *all* fail

// ### Example:

// ```js
// Promise.any([p1,p2,p3,p4,p5,p6,p7,p8])
//   .then(console.log)
//   .catch(console.log);
// ```

// ### Output:

// ```
// p1 done
// ```

// (because p1 is first to resolve)

// ### If ONLY p5 existed:

// ```js
// Promise.any([Promise.reject("p5 failed ❌")])
//   .then(console.log)
//   .catch(console.log);
// ```

// You get an `AggregateError`:

// ```
// AggregateError: All promises were rejected
// ```

// Useful for:

// * "Give me the first working server response"
// * "Try multiple sources, use whichever responds first"
// * "Race multiple fallbacks"

// ---

// # ⭐ 3. **Promise.race()**

// ### ✔ Returns **first promise to settle**

// (settle = resolve OR reject)

// ### ❗ That means the race can end in success or failure

// Example:

// ```js
// Promise.race([p1,p2,p3,p4,p5,p6,p7,p8])
//   .then(console.log)
//   .catch(console.log);
// ```

// ### Output:

// ```
// p1 done
// ```

// Because p1 resolves first.

// But imagine this:

// ```js
// const slowResolve = new Promise(res =>
//   setTimeout(() => res("resolved"), 2000)
// );

// const fastReject = new Promise((res, rej) =>
//   setTimeout(() => rej("rejected first"), 100)
// );

// Promise.race([slowResolve, fastReject])
//   .then(console.log)
//   .catch(console.log);
// ```

// ### Output:

// ```
// rejected first
// ```

// Useful for:

// * Timeout promises
// * “Whichever API responds first”
// * Abort slow operations

// ---

// # 🎯 Summary Table

// | Feature            | Promise.all         | Promise.allSettled | Promise.any             | Promise.race                |
// | ------------------ | ------------------- | ------------------ | ----------------------- | --------------------------- |
// | Rejects if 1 fails | ✅ Yes               | ❌ No               | ❌ No (only if ALL fail) | ⚠️ Yes (if first is reject) |
// | Returns values     | Only if all success | All results        | First success           | First to finish             |
// | Use case           | All must succeed    | Need all results   | First good result       | Fastest result (good/bad)   |

// ---

// # If you want, I can also show:

// 🔥 Side-by-side comparison with timeline diagrams
// 🔥 Real world use cases for each (API calls, retries, UI loaders)
// 🔥 How these behave with **async/await** instead of .then/.catch

// Just tell me!

