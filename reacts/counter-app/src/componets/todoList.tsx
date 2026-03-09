import { TodoItems, type ITodoItems } from "./todoItem";



export const TodoList = ({ todo, onToggle, onDelete }: ITodoItems) => {

if(!todo.length){
    return (
        <div style={{textAlign:'center', color:'white'}}>
                no task added
        </div>
    )
}

return(
    <ul style={{listStyle:'none'}}>
        {todo.map((todo)=>{
            <TodoItems key={todo.id} todo={todo} onDelete={onDelete} onToggle={onToggle}/>
        })}
    </ul>
)
}