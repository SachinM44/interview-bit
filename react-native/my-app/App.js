import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TodoInput from './comonent/TodoInput';
import TodoList from './comonent/Todolist';
import { useState } from 'react';

export default function App() {

const [todos, setTodo]=useState([]); // so the list of todo is boing to be an array 


const addTodo=(text)=>{
setTodo([...todos, {id:Date.now(), text, completed:false}])
}


const toggleTodo=(id)=>{
  setTodo(todos.map(todo=>
    todo.id==id ? {...todo, completed: !todo.completed} : todo
  ))
}

const deleteTodo=(id)=>{
  setTodo(todos.filter(todo=>todo.id !==id))/// so if there is no id associated with that todo , it wont be there in that todo
}



  return (
   <SafeAreaProvider>
    
   <TodoInput onAddTodo={addTodo}/>

   <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo}/>


   </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
