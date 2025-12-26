
/// what sis currying 
// function main(a){
//     return function(b){
//          return function(c){
//             return a+b+c
//          }
//     }
// }
// console.log(main(1)(3))


/// how will give size of array to 100

// const array=[]
// array.length=100

// console.log(array.length)


///modren es6 using array methode 

const array=new Array(100).fill('3')
console.log(array.length)
console.log(array)

console.log(typeof(array))
console.log(typeof(NaN))
console.log(typeof(undefined))