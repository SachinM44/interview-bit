// this file has curring in javascript 
//-> suppose you have function which need 3 parameter and you got only to parameter from input , when how will you call add funciton to add those 3 parameters , for that use curring in js 
function add(a){
    return function(b){
        return function(c){
            return a+b+c 
        }
    }
}
console.log(add(5)(3)(4))
//this is currying , where the function not lets u execute unitll and unless you dont have all arguement from the input 
// practicality is => when are doing automated email function 