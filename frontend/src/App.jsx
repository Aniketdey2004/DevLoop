import { Navigate, Route, Routes } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import PageLoader from './components/PageLoader';
import { useEffect } from 'react';
function App() {
  const checkAuth=useAuthStore((state)=>state.checkAuth);
  const isCheckingAuth=useAuthStore((state)=>state.isCheckingAuth);
  const authUser=useAuthStore((state)=>state.authUser);

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  if(isCheckingAuth)
  return <PageLoader/>
  return (
    <>
      <Routes>
        <Route path='/' element={authUser?<HomePage/>:<Navigate to={"/login"}/>}/>
        <Route path='/signup' element={!authUser?<SignUpPage/>:<Navigate to={"/"}/>}/>
        <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to={"/"}/>}/>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
