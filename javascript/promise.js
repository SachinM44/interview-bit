// prosimis in the js handles the asyc task in js , unlike the callbacks this give the more readable and sturctured approch than the callbacks 
// ptomise give 3 state - pending , fullfilled , rejcted 
const data = {
    name : "sacjin ",
    age : 33,
    stay : "blr"
}
function fetchdata(){
    return new Promise((resolve , reject)=>{
        setTimeout(() => {
            resolve(data)
        }, 2000);
    })
}
fetchdata().then(
    data=>{
        console.log("data:" , data)
    }
).catch(err=>{
    console.log(err)
});
/////////////////////////////
