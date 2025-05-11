// the genarator js is the is the special type of the funvtion where is pause its execution and resume it later 
function* infinate(){
    let num=1
    while(true){
        num++;
        console.log("hello")
        console.log(num)
    }
}
const call =infinate()
console.log(call)