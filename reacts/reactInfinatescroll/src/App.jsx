
import React from "react";
import { useEffect } from "react";
import { useState } from "react";


const App=()=>{
  const [state , setState] = useState(50)

 

  useEffect(()=>{
     const hasReachedEnd=()=>{
      /// add the buffer as well at the end 
      ///so here u are calculating the screen height 
      if(window.innerHeight + window.scrollY >= document.body.offsetHeight-30){
        setState( prev=>prev + 50)
      }
     }
   window.addEventListener('scroll',hasReachedEnd)

   return () => window.removeEventListener('scroll',hasReachedEnd)
  },[])

  const elelments=[];
  for(let i=0; i <state; i++){
    elelments.push(<div key={i}>{i+1}</div>)
  }
    return (
    <div>
  {elelments}
    </div>
  )
}

export default App