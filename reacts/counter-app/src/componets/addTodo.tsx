import { useState } from "react"

export interface IAddTodd {
    addTodo: string
}

export const AddTodo = ({ addTodo }: IAddTodd) => {
    const [text, setText] = useState("")

    const handleInpput = () => {
        if (!text.trim()) return;
        addTodo(text.trim());
        setText("")
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: 10 }}>
            <input type="text" value={text} onChange={(e) => e.target.value} > enter the todo</input>
            <button type="submit" onClick={handleInpput} style={{ color: 'red', padding: 10 }} > add</button>

        </div>
    )
}


