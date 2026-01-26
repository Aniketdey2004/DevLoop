import { Navigate, Route, Routes } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Layout from "./pages/Layout";
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Network from './pages/Network';
import Notification from './pages/Notification';
import Project from './pages/Project';
import PostPage from './pages/PostPage';
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios';
import toast from 'react-hot-toast';
import ProjectPage from './pages/ProjectPage';



function App() {
  //each component subsribes to a querykey if the querykey value changes it is rerendered
  //untill there is one subscriber of a cached Data the data will never be garbage collected
  console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
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
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });


  if(isCheckingAuth)
  return <PageLoader/>
  return (
    <>
      <Routes>
        <Route path='/' element={authUser?<Layout/>:<Navigate to={"/login"}/>}>
          <Route index element={<Feed/>}/>
          <Route path='profile/:userId' element={<Profile/>}/>
          <Route path="network" element={<Network/>}/>
          <Route path='notifications' element={<Notification/>}/>
          <Route path='project/:projectId' element={<ProjectPage/>}/>
          <Route path='project' element={<Project/>}/>
          <Route path='posts/:postId' element={<PostPage/>}/>
       
        </Route>
        <Route path='/signup' element={!authUser?<SignUpPage/>:<Navigate to={"/"}/>}/>
        <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to={"/"}/>}/>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
