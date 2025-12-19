import { useCallback, useRef } from "react"


export const useThrottle=<T extends (...args:unknown[])=> unknown>(
 callback:T,
 delay:number
)=>{

const lastRun=useRef(0)
    return useCallback((...args:Parameters<T>)=>{
        const now=Date.now();
         
        if(now-lastRun.current>=delay){
            lastRun.current=now
            callback(...args)
        }
    
    },[delay,callback])
}