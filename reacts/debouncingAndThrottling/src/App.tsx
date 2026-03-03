import { useEffect, useState } from "react";
import useDbounce from "./hooks/debounce";

function App() {
  // const [position, setPosition] = useState({ x: 0, y: 0 });

  // const handleMouseEvent = useThrottle(
  //   (e: React.MouseEvent<HTMLDivElement>) => {
  //     setPosition({ x: e.clientX, y: e.clientY });
  //   },
  //   1000
  // );

  // return (
  //   <div onMouseMove={handleMouseEvent} className="h-screen">
  //     <p>
  //       Mouse: {position.x} {position.y}
  //     </p>
  //     <p>this is the mouse movement</p>
  //   </div>
  // );

  /// how u gonna use that debounce thing 

  const [hasterm, setTerm] = useState<string>("")
  const [result, setReslut] = useState(null)

  const handleChage = useDbounce((value: string) => {
    setTerm(value)
    console.log('this is getting fired')
  }, 2000)

  useEffect(() => {
    const fetchApi = async () => {
      const cancelled = false;
      try {
        const res = await fetch('/////')
        const data = await res.json()
        if (!cancelled) {
          setReslut(data)
        }
      } catch (err) {
        console.log(err, 'somthing went wrong')
      }finally{
        if(!cancelled){
          setTerm(false)
        }
      }
    }

    return ()=>{
      canceed=true
    }
  }, [useEffect])

  return (
    <div>
      <input
        type="text"
        placeholder="enter ur things here "
        onChange={(e) => handleChage(e.target.value)}/// to acces the currecnt input valeu
      />
      <li>{result?.title}</li>
    </div>
  )

}

export default App;
