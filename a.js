///cyrring in the js

function add(a){
    return function(b){
        return function(c){
            return a+b+c
        }
    }
}
const result=add(3)(3)(3)
console.log(result)