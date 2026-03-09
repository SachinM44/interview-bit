export interface ITodoItems {
    todo: string,
    onToggle: () => void,
    onDelete: () => void
}


export const TodoItems = ({ onDelete, todo, onToggle }: ITodoItems) => {



    return (
        <li style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 8, background: "#f9fafb",
            border: "1px solid #e5e7eb", marginBottom: 8,
        }}>
            <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)}
                style={{ width: 14, height: 11, cursor: 'pointer', accentColor: 'rebeccapurple' }} />
            <span style={{ flex: 1, fontSize: 14, color: todo.done ? "red" : "green" }}>{todo.text}</span>
            <button onClick={()=>onDelete(todo.id)}></button>
        </li>
    )
}