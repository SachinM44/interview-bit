

const nums=[3,44,6,44,2,2,1]

const result=nums.find(n=>n>5)

console.log(result)




const result1=nums.findIndex(n=>n>5)

console.log(result)
let name1='sachin';
const inluded=nums.includes(3)
console.log(inluded)

console.log(name1.includes('39338'))

let fcker=['like','dont like'];

// console.log(fcker.includes('ke','ke'))

// false
// 🔍 Why is it false?
// 1️⃣ Array.prototype.includes() signature
// js
// Copy code
// array.includes(searchElement, fromIndex?)