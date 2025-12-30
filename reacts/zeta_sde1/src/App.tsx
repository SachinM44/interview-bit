import { BrowserRouter, Route, Routes, } from 'react-router-dom'
import { Counter } from './componets/counter'
import { Home } from './componets/Home'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
       <Route path='/counter' element={<Counter />} />
      <Route path='/' element={<Home />} />
    </Routes>

    </BrowserRouter>
  )
}
export default App