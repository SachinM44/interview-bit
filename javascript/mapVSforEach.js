

const arr=[1,2,3,4]
const newArray= arr.map((i)=>i+1)
console.log(newArray)
//// so the map is for tranformation , will not mutate the origin state 
const forEachArra=[]
//but for each is for sideEffect , will can mutate the original array
arr.forEach(i=>{
    forEachArra.push(i*2)
})

console.log(forEachArra)



const a={
    age:38
}

b=a.age;  //here since the {obj} is non-primitive dt , it stores the referenc not the value , so both a, b will pointing out to {age:38}
b.age=100 // // here when u modify it both will will become {age:100}
console.log(a.age)  // so here for the obj is will refer to that aboject so it will be passed by reference

// //the correct ans 
// What happens:

// Objects are non-primitive (reference) data types

// a stores a reference (memory address) to the object { age: 38 }

// b = a copies the reference, not the object

// Both a and b point to the same object in heap memory

// Modifying b.age mutates the shared object

// Therefore, a.age is also updated

// 🧠 What is this called?
// 🔥 Correct term:

// Objects are passed by value, but the value is a reference

// Short interview version:

// Objects are assigned by reference


/////here when u dont want make it for reference you can do thi 


const myAge={
    age:33
}

b={...myAge}
b.age=44
console.log(myAge.age)// now here it wont change , so its called shallow copy 
//now lets understand deep copy 
// where there is a deeply nexted 
const newAge={
    info:{
        age:44,
        name:'sharma'
    }
}

const c={...newAge}
c.info.age=200
console.log(newAge.info.age)//==200 /// now also the newAge will be modified , why becouse here there is again shallow compy issue , 
/// salution make it deep copy 


const deepCopy={
    info:{
        age:38,
        name:'suresh'
    }
}

 r = {
    ...deepCopy,
    info:{
        ...deepCopy.info
    }
}

r.info.age=444
console.log(r.info.age)
console.log(deepCopy.info.age)



/// in new age we can do deep copy by using structuredclon 

const copy =structuredClone(newAge)
console.log(copy)

let string='sachin';

const reversed = string.split('').reverse().join('');

console.log(reversed)

console.log(string===reversed)