import { useState , useEffect, useContext} from "react"
import { UserContext } from "./conext/useCallback";
/// use con
// etxt is the special hook that lets use acces ontext value , without qrapping up the functions with the constext.consumer
const App = () => {



  const 
  

  const [todos, setTodos]=useState([])/// so this will have empty array  right , the todo arrat
  const [input, setInput ]=useState('');
  const [loading, seLoading]=useState(false);
////

useEffect(()=>{

const fetchAPI=()=>{
  fetch('url')
  .then(res=>res.json())//we have to string fy ths
  .then(data=>setTodos(data))//data


  ///clearpn 

  return()=>{
    console.log( "this is getting cleanededup ")
  }
}

},[todos])


if(!todos){
  return <div>loaindg</div>
}


const addTodo=()=>{
  setTodos([...todos,input])
  setInput('')///unmounting the setinput thing
}

  return (
   <UserContext.Provider value={{user, setUsr}}>
     <div>
    <p>hello there</p>
  <input type="text" onChange={(e)=>setInput(e.target.value)} value={input} />
  <button onClick={addTodo}> add todo</button>
  <ul>
    {todos.map(index, todo)=> <li key={index}>{todo}</li>}
  </ul>
    </div>/// so when the provider valye changes all the things that there at the consumer componet will rereders</UserContext.Provider>

   </UserContext>
  )

}
export default App