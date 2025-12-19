////here in throttling it will run specified timline no matter how of that event happedn or not . 
//best for window resizing etc 


const throttling=(fn, delay)=>{
    const lastCall=0;
    return (...args)=>{
        const now=Date.now()
        console.log(now)
        if(now-lastCall >= delay){
            lastCall=now
            fn(...args)
        }

    }
}


//// good way 

const thottle=(fn, limit)=>{
let throttled=false
return (...args)=>{
   if(!throttled){
    fn.apply(this,args)
    throttled=true
    setTimeout(() => {
      throttled=false
    }, limit);
   }
}
}

const hnadleSColl=throttling(()=>{
    console.log('scoll position', window,scrollY)
},)


console.log(hnadleSColl())