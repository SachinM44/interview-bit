
import React, { useEffect, useState } from "react";

 function App(){
const [data, setData]=useState('');
const [loading, setLoadin]=useState(true);

useEffect(()=>{
  fetch("https://fakestoreapi.com/products/1")
  .then((res)=> res.json({}))
  .then((result)=>setData(result))
  setLoadin(false)
},[])

return(
  <div>
    <h1>
      {JSON.stringify(data)}
    </h1>
  </div>
)

}
export default App
