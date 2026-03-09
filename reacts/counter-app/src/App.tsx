import { useState } from "react"



const App = () => {

  const [todos, setTodos] = useState('')

  const addTodo = (text) =>
    setTodos((prev) => [...prev, { id: Date.now(), text, done: false }]);

  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));

  const deleteTodo = (id) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <>
    </>
  )
}
export default App