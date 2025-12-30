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
user.wife.age=344
user.age=45
console.log(user)
