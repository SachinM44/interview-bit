import { useEffect, useState } from "react"

export const Counter = () => {
    const [count, setCount] = useState(100)

    useEffect(() => {
        if(count===0) return;
        const interval = setInterval(() => {
            setCount((preveCount => preveCount - 1))
        },1);

        return () => clearInterval(interval)
    }, [count])
    return (
        <div>
            {count}
        </div>
    )
}