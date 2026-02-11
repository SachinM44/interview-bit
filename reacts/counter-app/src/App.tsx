import { useRef, useState } from 'react'
import './App.css'
import Button from './componets/button'

function App() {
  const [count, setCount] = useState(0)
  const timeRef = useRef<number | null>(null);

  const onStart = (): void => {

    if (timeRef.current) {
      clearInterval(timeRef.current)
    }
    timeRef.current = setInterval(() => {
      /// so here the problem is here , this setInterval run on different que , so we are here not using any use effect , and everytime it refernace to the count varible it get it as 0 only 
      ////so what we can do , any method that useState updates , it accepts the callback function as well for undating the count varible (may be anything) so do add callback fn 
      setCount((count) => count + 1)
    }, 1000);
  }
  
  const onResume = (): void => {

    if (timeRef.current) {
      clearInterval(timeRef.current)
      timeRef.current = null
    } else {
      timeRef.current = setInterval(() => {
        setCount((count) => count + 1)
      }, 1000)
    }
  }

  return (
    <>
      <div className='flex flex col'>
        <p>
          count is : {count}
        </p>
        <Button onClick={onStart} name='start' />
        <Button onClick={onResume} name='resume' />
      </div>

    </>
  )
}

export default App
