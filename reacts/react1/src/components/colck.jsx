import React, { useEffect, useState } from "react";
const Timer=()=>{
const [time, setTime]=useState(0);
useEffect(()=>{
    const interval=setInterval(() => {
        setTime((prveTime)=> prveTime + 1)
    }, 1000);
    return ()=>{
        clearInterval(interval)
    }
})


return( 
    <div className="p-10m">
        timer is : {time} secods
    </div>
)
}
export default Timer