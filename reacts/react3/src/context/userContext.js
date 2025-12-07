import React, { createContext, useState } from "react";
export const UserContext=createContext();


export function UserPorvider({children}){
const [user ]=useState({name:"jon"})


return (
    <UserContext.Provider value={user}>
        {children}
    </UserContext.Provider>
)
}