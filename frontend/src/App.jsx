import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout.jsx';
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={HomePage}/>
        <Route path='/signup' element={SignUpPage}/>
        <Route path='/login' element={LoginPage}/>
      </Routes>
    </Layout>
  )
}

export default App
