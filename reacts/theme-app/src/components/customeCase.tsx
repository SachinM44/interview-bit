import { memo } from "react"

export interface ICustomecasePorps{
   value:number | ((e:number)=>boolean)
}

const CustomeCase=memo(({value}:ICustomecasePorps)=>{
 return(
    <div>
{value}
    </div>
 )
})


export default CustomeCase