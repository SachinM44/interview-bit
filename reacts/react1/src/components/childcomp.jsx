import { useContext } from "react"
import React from "react"
import { UserContext } from "../context/userContext"

const ChildCopm=({message})=>{
    const user=useContext(UserContext)
return <div>
    <p>this is the child comp </p>
    <div>
        this the final message : {message}
    </div>
    <div>
        the name is {user.name}
    </div>
</div>
}
export default ChildCopm