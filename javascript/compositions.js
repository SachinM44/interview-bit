// when you have this 
function add(args){
    return args[0] * args[1];
}
function sqaure(num){
 return num*num
}
// then you want sqaure of add numbers
console.log(sqaure(add(2,3)))
//simpler version with function 
function addAndSuare(a,b){
return sqaure(add(a,b))
}
console.log(addAndSuare(2,4))
//now the probelm is you have hundreds of funvtion like this how can you call funvtion inside the funvtion ? by using composistions 
function compositionOfTwoFn(f1,f2){
    return function(a,b){
        return f2(f1(a,b))
    }
}
const task=compositionOfTwoFn(add, sqaure);
console.log(task(22,3))
//when you want to compose unlimited functions (use .. for that )
function cmpose(...fn){
    return function(...value){
    return fns.reduce((a,b) => b(a),value)
    }
}