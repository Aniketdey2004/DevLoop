import React from 'react'
import { MailIcon, LockIcon, Loader } from 'lucide-react';
import { Link } from "react-router";
import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading: isLoggingIn } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries("authUser");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  })

  const { mutate: googleLoginMutation, isLoading: isGoogleLogin } = useMutation({
    mutationFn: async (token) => {
      const res = await axiosInstance.post("/auth/google", { token });
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries("authUser");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    loginMutation(formData);
  }
  const handleGoogleSubmit = (credentialResponse) => {
    googleLoginMutation(credentialResponse.credential);
  }
  return (
    <div className='min-h-screen flex justify-center items-center bg-lime-50 px-4'>
      <div className='max-w-6xl w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl min-h-[90vh] md:min-h-[70vh] lg:min-h-[90vh] flex'>
        {/* Left section */}
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-4'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-center text-lime-800 mt-8 mb-2'>Welcome Back, Developer</h1>
            <h2 className='mt-2 text-center font-medium text-lime-600 text-xl mb-4'>Continue building where you left off</h2>
          </div>
          <form className='w-full' onSubmit={handleSubmit}>
            {/* email */}
            <label htmlFor='email' className='auth-input-label'>Email</label>
            <div className='relative mb-3'>
              <MailIcon className="auth-input-icon" />
              <input type='email' className='input' id='email' placeholder='johndoe@gmail.com' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            {/* password */}
            <label htmlFor='password' className='auth-input-label'>Password</label>
            <div className='relative mb-3'>
              <LockIcon className="auth-input-icon" />
              <input type='password' className='input' id='password' placeholder='Enter your password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <button className='auth-btn' type='submit' disabled={isLoggingIn || isGoogleLogin}>
              {isLoggingIn ? <Loader className='size-8 animate-spin mx-auto' /> : "Sign In"}
            </button>
          </form>
          <div className='mt-5 text-gray-600'>
            Don't you have an account?&nbsp;
            <Link to="/signup" className='text-lime-400'>Signup</Link>
          </div>
          <div className='flex items-center gap-2 w-full px-4 mt-2'>
            <div className='border-b w-[45%] border-slate-600'></div>
            <div className='text-slate-600 text-lg'>or</div>
            <div className='border-b w-[45%] border-slate-600'></div>
          </div>
          <div className='w-3/5 rounded-lg mt-5'>
            <GoogleLogin
              onSuccess={credentialResponse => handleGoogleSubmit(credentialResponse)}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>
        </div>
        {/* right Section */}
        <div className='hidden md:block md:w-1/2  relative bg-lime-600 rounded-r-2xl p-4'>
          {/* <div className='absolute inset-0 bg-lime-900/25 rounded-r-2xl'></div> */}
          <div className='h-full w-full flex flex-col justify-center items-center'>
            <div className='h-[70%]'>
              <img src='./login.png' alt='login image' className='w-full h-full' />
            </div>
            <h2 className='text-3xl font-bold text-center text-white'>Your projects are waiting</h2>
            <h4 className='text-white text-center font-medium text-lg'>Reconnect with your network and keep shipping meaningful work</h4>
          </div>
        </div>
      </div>
    </div>
  )
}
