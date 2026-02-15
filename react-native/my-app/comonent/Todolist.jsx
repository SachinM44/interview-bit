import { FlatList } from "react-native"
import TodoItem from "./TodoItem"




const TodoList=({todos, onDelete, onToggle})=>{
   return(
   <FlatList
   data={todos}
   keyExtractor={item=>item.id.toString()}
   renderItem={({items})=>{
    <TodoItem 
     todo={items}
     onDelete={onDelete}
     onTogle={onToggle} />
   }}
   />
   )
}