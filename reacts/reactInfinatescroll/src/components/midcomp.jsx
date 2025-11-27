import ChildCopm from "./childcomp"
import React from "react"
const Midcomp=({message})=>{
return <div>
    <p>
        this is the mid comp 
    </p>
    <div>
        <ChildCopm message={message}  />
    </div>
</div>
}
export default Midcomp