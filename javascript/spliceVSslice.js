const { object } = require("webidl-conversions");

const array=[3,34,54,5,5,3,3,2,2,2]

console.log(array.slice(0,4));
console.log('-------------------------')
console.log(array.splice(1,4))
console.log(array)

///so basically that splice thing will mutate ur origininal array entirely , and it can alter , delete , add etc ..
class a {

}
console.log(typeof(a)
)


let arr=[3,4,5,6,2]
arr.length=393
console.log(arr)



const user={
    name:'bulla',
    age:33,
    location:'malpe',
    wife:{
        name:'pushpa',
        age:33
    }
}
Object.freeze(user)
Object.freeze(user.wife)///if u want to freez only one kye , then u can use thia
user.wife.age=344
user.age=45
console.log(user)



// const debounce=(func, delay)=>{
//     let timer;
//     return (...args)=>{
//         clearTimeout(timer)
//     timer= setTimeout(() => {
//        func.apply(this, args) 
//      }, delay);
//     }
// }


// const apicall=debounce(()=>{
//     console.log('api call is happening')
// },5000)

// apicall()



const throttling=(func,delay)=>{
    let lastCall=0;
    return (...args)=>{
    let now=Date.now()
    if(now-lastCall >= delay){
        lastCall=now
        func(...args)
    }
    }
}

const thorttledCall=throttling(()=>{
    console.log('api is calling' ,Date.now())
},1000)


setInterval(() => {
    thorttledCall()
}, 200);