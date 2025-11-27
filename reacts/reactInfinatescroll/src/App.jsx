import { useEffect } from "react";
import { useState } from "react"

const InfinateLoop=()=>{
const [count , setCount] =useState(50)

useEffect(()=>{
const hasReachedEnd=()=>{
  if(window.innerHeight+window.scrollY >= document.documentElement.scrollHeight-30){
    setCount(prev=>prev+50)
  }
}
window.addEventListener('scroll',hasReachedEnd)
 return ()=> window.removeEventListener('scroll',hasReachedEnd)
},[])

const elements=[];
for(let i=0; i<count; i++){
   elements.push(<div key={i}>{i+1}</div>)
}

  return(
    <div>
     {elements}
    </div>
  )

}
export default InfinateLoop