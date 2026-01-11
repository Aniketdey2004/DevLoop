import { Navigate, Route, Routes } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import Feed from './components/Feed';
import Profile from './components/Profile';
import Network from './components/Network';
import Notification from './components/Notification';
import Project from './components/Project';
import Settings from './components/Settings';
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios';
import toast from 'react-hot-toast';


function App() {
  //each component subsribes to a querykey if the querykey value changes it is rerendered
  //untill there is one subscriber of a cached Data the data will never be garbage collected
  const {data:authUser, isLoading:isCheckingAuth}=useQuery({
    queryKey:["authUser"],
    queryFn:async()=>{
      try {
          const res=await axiosInstance.get("/auth/me");
          return res.data;
      } catch (error) {
        if(error.response && error.response.status===401){
          return null;
        }
        throw error;
      }
    },
    onError:(error)=>{
      toast.error(error.response.data.message);
    }
  })


  if(isCheckingAuth)
  return <PageLoader/>
  return (
    <>
      <Routes>
        <Route path='/' element={authUser?<HomePage/>:<Navigate to={"/login"}/>}>
          <Route index element={<Feed/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path="network" element={<Network/>}/>
          <Route path='notifications' element={<Notification/>}/>
          <Route path='project' element={<Project/>}/>
          <Route path='settings' element={<Settings/>}/>
        </Route>
        <Route path='/signup' element={!authUser?<SignUpPage/>:<Navigate to={"/"}/>}/>
        <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to={"/"}/>}/>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
