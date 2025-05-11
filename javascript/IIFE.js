///IIFE = Imideatly Involked function Expression
// know for its execution immiteatly after its decalration 
(function sub(a,b){
    return (a-b)
})(2,3)
(function add(a,d){
    console.log(a+d)
})(2,3);
// it will invok automatically 
(function say(){
    console.log("hello")
})()
//usecases => avoid polluting golbal name spaces 
//means when you create let age; , it will be polluted by any other funvtion if they involk this varible , for that 
(function IIFE(){
    let never 
    let getSpoiled
}) 
// now those varible inside the IIFE will never gets pulluted , and they will kill once the funvtion is executed 
//2nd -> execute an async function
// how ill you write normal fetch call 
const data=0;
async function getData(params) {
  data= await fetch("________")
}
// but this way will make you better 
const date=(async ()=>await fetch())()
///lets make it easy by using atm design which it lets you know ur balence only when you make withdral
const atm = (function(initialBalance) {
    let balance = initialBalance; // Use let instead of const
    function withdraw(amt) {
        if (amt > balance) {
            return "nim appanda atm?";
        } else {
            balance -= amt;
            return balance;
        }
    }
    return { withdraw };
})(1000); // Immediately invoke the function with the initial balance

console.log(atm.withdraw(100)); 