//closures in js 
// this is the funciton when it remember itss env variabel even after finishing the execution \
// whats ths use , like others , in js thereo is not oficial way to decalre the private varibales inside an aboject 

function closure(){
let count=0;
 return {
    incriment: function(){
        count++
        return count;
    },
    dicriment: function(){
        count--
        return count;
    },
    display: function(){
        let message = "the current count is "+ count
        return message
    }
 }
}

const closure1=closure()
console.log("jdbdshvv")
console.log(closure1)