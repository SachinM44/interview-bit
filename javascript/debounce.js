// so debounce is executes once after the activity/event stops 
///mean when the user is keep on typing it does nothing , when the user stops clicking/typing - after perticular delay it will trigger 


//lets say i keep on entering and i stopped after 1 second it will start execute 
const debounce=(fn, delay)=>{
    let timer;
    return (...args)=>{
        clearTimeout(timer)
       timer=setTimeout(() => {
        fn.apply(this,args)
       }, delay);
    }
}


// how you will use this 
const handleSeach=debounce(()=>{
    console.log('api call ')
},5000)

handleSeach()


///oneword user started typed , released typing(event done) after 1 second it will it will run 