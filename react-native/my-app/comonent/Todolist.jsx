import { FlatList } from "react-native"
import TodoItem from "./TodoItem"




const TodoList=({todo})=>{
   return(
   <FlatList
   data={todo}
   keyExtractor={(items)=>{
    <TodoItem 
   }}
   />
   )
}