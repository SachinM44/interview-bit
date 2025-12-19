import { useCallback, useRef } from "react"


const useDbounce=<T extends (...args:unknown[])=> unknown> (
    callback:T,
    delay:number
)=>{

    const timerRef=useRef<typeof setTimeout>(null)
 return useCallback((...args:Parameters<T>)=>{
if(timerRef.current){
    clearTimeout(timerRef.current)
}

    timerRef.current=setTimeout(() => {
        callback(...args)
    }, delay);
 },[callback, delay])
}

export default useDbounce