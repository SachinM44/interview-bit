// what is iterator pattren in javascript 
// what are genarator functions 
// YEILD keyword in js

// iterator and generator are the concept of iteration that provides the mechanism for customizing the beheviour of for..of loops 
 for(const value of [1,2,3,4,5,6,7]){
    console.log(value)
 }
 // when you run this , why it should read that array from left to right , and that is done by inbuilt iterator 
 
 // how you can create your own iterator (full for large company database )
 function makeIterator(start=0 , end= Infinity, stepSize=1){
   let nextStart=start;
  let itteratorCount=0;
  return{
   next(){
      let result;
      if(itteratorCount < end){
         result ={ value:nextStart, done:false };
         nextStart = nextStart+ stepSize;
         itteratorCount++;
         return result;
      }
      return {value :itteratorCount , done : true}
   }
  };
}
  const iterator=makeIterator(0,0,0);
  let result =iterator.next();
  while(!result.done){
   console.log(result.value);
   result=iterator.next()
  }
// genarator can be used by function* 

// YEILD 

function* add(){
   yield 2;
   yield 3;
   yield 4;

}
const even = add()
for(const v of even){
   console.log(v)
}
// now for creating ur own iterator , insted of difining it by userself like myiterator , you can use genarator funvtion with yeild keyword 
function* newItr(start , end , stepSize){
   for(let i=start; i <=end; i+=stepSize){
      yield i;
   }
}
const one=newItr(10,15,10);
for(const val of one){
   console.log(val)
}