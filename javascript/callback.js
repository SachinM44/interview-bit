// so when the function accept other function as an argument , so that it can execut in that order , so it will lead to callback hell ,  so it will lead to bad readabality and un maintainability , 

let frutes=['mango', "banana", 'watermelon']

function callbackhell(){
    setTimeout(() => {
        animate(frutes[0]);
        setTimeout(() => {
            animate(frutes[1]);
            setTimeout(() => {
                animate(frutes[2])
            }, 1000);
        }, 1000);
    }, 1000);
};
function animate(frutes){
    console.log("printing"+ " " + frutes)
}
callbackhell(animate)