
//switch  case component in react 
import './App.css'
import CustomeCase from './components/customeCase'

function App() {

  return (
    <>
    <CustomeCase value={0} />
    <CustomeCase value={(e:number)=>e>10}/>

    </>
  )
}

export default App
