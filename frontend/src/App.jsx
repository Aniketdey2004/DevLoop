import { Route, Routes } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
function App() {
  return (
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
      </Routes>
  )
}

export default App
