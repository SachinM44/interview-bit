///map 
//const array =[1,2,3,4];
// //uses treansftermation , means applaying the map map funntion two multipy teh entire array all at once 
//  const prices=[22,34,53,564];

//  const pricesafterTax=prices.map((price )=>{
//      return price + 1.2;
//  })
//  console.log(prices)
//  console.log(pricesafterTax);
//  //soo the map funvtion is similar to for each statement but it doesnt overwrite that original array but it create new array 
// //this is the one line map funvtion 
// const pricesafterTax1=prices.map(prices =>prices + 120 );
////////////////////////////
// // the call baxk based function  

// function fetchdata(callback){
//   setTimeout(()=> {
//     console.log("data is being fetcehd ")
//     callback("samble data")
//   }, [4000]);
// }

// fetchdata((data)=>{
//   console.log("prosseing", data)
// })
// //////////////
// // consverting this above callback hell into async and await programming 

//// here is the another exaple for call back function 
//which is syncronus call back fn 
// const name=['james ', 'dune ', 'ram'];

// const  callbackfn=(arr , cb)=>{
//     for(let i=0; i< arr.length; i++ ){
//       const elemt = arr[i];
//       cb(elemt)
//     }
// }

// callbackfn(name, (name)=>{
//   console.log(name)
// })
///////////////////////
//not this is the async callback 
// const loadPokemon=(id, cb)=>{
//   fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
//   .then(res=> res.json())
//   .then(data=> data.json()))
// }
//////////////////////
const array=[2,2,3 ,4 ,4, ];
const callback=(array)=>{
    return array*2
}
const double=array.map(callback)
console.log(double)
// so the map function takes the another function as the callback function 
// and that function will retun what does it do 
// const trpiple= array.map(array=> Math.sqrt(array));
// console.log(trpiple)
// console.log("now the filetr function now")

// const ages=[22,34,5,55,64];

// const fiterAge=ages.filter(age => age>22 )
// console.log("age which is greater than 12 " , fiterAge)
// so basically the fiter method is for filtering the somthing from teh the array without motifu=ing it and which leads to the new array 
///////////////////////////////
//now the reduce : > unlike the map and filter it doent filter create the new array insted it reduce the entire array by reduing it into as per the conditions 
const array1=[25,5];
 let res=array1.reduce((total,x  )=> total + x ,0);
 console.log(res)
 ////////////////////////////
 //some method ( means even if the simple elemet in the entire array satisfy the condition it will resturn true )
 let hasgradeA=array.some((x)=> x<4 )
console.log(hasgradeA)
// with opposite to the some methode , if every value aggrigate teh condition then only every retuns true 

let isPass=array.every((x)=> x>=2)
console.log(isPass)

//////////////////spered and rest operatior in js 
// to the spread , name only say it spreads or expands the array or object  furhtur 
// is its and array 
let ar=[3,4,5];
let ar2 = [...ar,5,6,7]
//for the  object 
const obj1={a:1,
    b:3,
    c:3
}
const bj3={
    ...ar,
    c:4 ,
    d:3
}
console.log(ar2)
console.log("objects ")
console.log(bj3)
//so rest oprator collect all the elememt in an array 
console.log("in teh function of spred operator ")
const sum=(x,y,z)=>{
    return x+y+z;
}
const nums=[1,1,1]
console.log(sum(...nums))
function greet(g1, g2, ...others) {
//   console.log(g1);        // "Hi"
// //   console.log(g2);        // "Hello"
  console.log(others);    // ["Namaste", "Hola"]
}
greet("Hi", "Hello", "Namaste","dsd","dsfsdfsd","ddfdadfa", "Hola");//
/////
console.log( " async await and promises ")
