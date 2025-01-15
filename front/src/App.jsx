// React
import { Routes, Route } from "react-router-dom"

// Paginas
import PageFormImage from './pages/p-form-image'
import PageListImage from './pages/p-list-image'
import PageLogin from "./pages/p-login"

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={< PageLogin />} />
        <Route path='/list' element={< PageListImage />} />
        <Route path='/add' element={<PageFormImage />} />
      </Routes>
    </>
  )
}

export default App
