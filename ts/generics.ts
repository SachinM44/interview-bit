// import { it } from "zod/locales"

// function genirc(args: number): number {
// return args
// }
// ///// so here when in the above function is numebr , lets say u want to be it the global function and the u want it to work with the any type 
// // what will u do 

// function  genericWithAny(args: any): any{
// return args
// } ///// so this  the wrong way of doign it 
// //insted 
// function generic<T>(arges:T[]): T {
// return arges[0]
// } 

// // so u can use it at any time 
// const ans=generic([
//   {
//     id:1,
//     id2:3
//   }
// ])

// function swaper(a:any,b:any):any{
//  const temp=a   
// a=b
// b=temp
// return [a, b]
// }
// console.log(ans.id)

// const swap=<T, U>(a:T, b:U):[T,U]=>{
// return [a,b]
// }

// const lol=swap(1,2)
// console.log(lol)


// console.log(swaper(1,3))
////how will you restric generic

/// one tip here im using this trialing comma hack where where u using extends keyword at this posing ts will complain if its ts file but the tsx file 

const ristGeneric = <T extends { length: number } ,>(item: T): T => {
   console.log(item.length)
   return item
};

console.log(ristGeneric({length:10}))
console.log(ristGeneric([2,3,5]))
