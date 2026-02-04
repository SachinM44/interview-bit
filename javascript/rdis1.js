// function fn1(){
//     return 2;
// }
// function fn2(){
//     return 4 ;
// };

// let a= [fn1(), fn2()]
// console.log(a) 
// what the out put ? 2,4
// the relust is 4 bcz , the of the comma operator in js , it means it evalueates all the expression but resturn only the last expression 
// // 
// console.log(true== ' ')
// // what will be the output ? 
// // i guess its empty string 
// let a=10;
// let b= new Number(10);
// let c=10
// console.log(a==b)
// //what it will resturn ?
//  // i guess it will restrun true
//  console.log(typeof(a));
//  console.log( typeof(b));
// let a={name:'Adarsh'};
// let z={...a};
// z.name="Adil";
// console.log(z.name)
// what will be the output 
///i guess its Adarsh
// what shallow copy and deep copy ?
// // i dont knwo :( 
// console.log(+true);
// console.log(!"xyz")
// // what the output 
// // due to the js coericstion its + and 1 , 1, and will give 0 
// now write the exaple for curring in js 
// function curring(a){
//     return function(b){
//         return function(c){
//             return a*b*c
//         }
//     }
// }

// console.log(curring(3)(4))
// ///
// const curring =a=>b=>c=> a*b*c;
// console.log(curring(2)(3)(4))
// const curring=(a)=>{
//     return (b)=>{
//         const add=a+b;
//         return (c)=>{
//             return add+c
//         }
//     }

// }

// console.log(curring(2)(3)(4))
// funciton to merge the 2 sting alternativly 


// const var1='hello sjdbsjd sddbds';
// const var2='wo sddg s rld 133'
// const mergAlternatively=(str1, str2)=>{
//     let result='';
//     let MaxLenght=str1.length+str2.length
//     for(let i = 0; i < MaxLenght; i++ ){
//       if(i<str1.length)  result += str1[i];
//      if(i<str2.length)    result += str2[i];
//     }
//     return result
// }

// console.log(mergAlternatively(var1, var2))
// how can you flatten this array 
// const array=[[1,2],[3,4],[4,5]]
// // const result=array.flat()
// // console.log(result)
// // // how will u do it without the inbuilt function 
// // function flatternTheArray(array){
// //       if(array.)
// // // }
// // const result=array.reduce((accum,value)=> accum.concat(value),[])

// // console.log(array)
// const array = [[1, 2], [3, 4], [4, 5]];
// // const result = array.reduce((acc, val) => acc.concat(val), []);
// // console.log(result); // [1, 2, 3, 4, 4, 5]
// const res=[];
// function flattenArray(value, res){
//     for(let i=0; i <value.length; i++){
//         if(Array.isArray(value[i])){
//             flattenArray(value[i], res)
//         }
//       else{ 
//          res.push(value[i])
//       }
//     }
//     return ; 
// }

// const result=console.log(flattenArray(array,res))


console.log([NaN].indexOf(NaN)); // -1
switch (NaN) {
  case NaN:
    console.log("Surprise, nothing logged "); // Nothing is logged
}