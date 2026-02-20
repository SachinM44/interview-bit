

const nums=[3,44,6,44,2,2,1]

const result=nums.find(n=>n>5)

console.log(result)

const top=nums.findIndex(n=>n>10)
console.log(top)


const result1=nums.findIndex(n=>n>5)

console.log(result)

console.log("===============")

let name1='sachin';
const inluded=nums.includes(3)/// true bcz u compareing this with just an number , not with the sting 
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