// this file has curring in javascript 
//-> suppose you have function which need 3 parameter and you got only two  parameter from input , when how will you call add funciton to add those 3 parameters , for that use curring in js 
function add(a){
    return function(b){
        return function(c){
            return a+b+c 
        }
    }
}
console.log(add(5)(3))
//in modren .js 
//const add = (a) =>  (b) => (c)=> a+b+c;
//this is currying , where the function not lets u execute unitll and unless you dont have all arguement from the input 
// practicality is => when are doing automated email function 
function autoEmail(name){
    return function(subject){
        return function(body){
console.log(`sending email to ${name} with ${subject} subject and with ${body} body `)
        }
    }
}

let step1= autoEmail("sachin69778@gmail.com")
let step2=step1("new user information ");
let step3=step2("bofy is created ")
// its just a multiple closures , inside the funcitons
// at the end this si the over all concept ot the calling the function isside the another funtion multple time for each argutment it 



function sum(a){
    return function(b){
        return function(c){
            return a+b+c
        }
    }
}

sum(1,2)
