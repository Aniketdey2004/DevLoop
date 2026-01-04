import React, { useState } from 'react'
import { CircleUserRound, MailIcon, LockIcon} from 'lucide-react';
import {Link} from "react-router";
import GoogleLoginComp from '../components/GoogleLoginComp';
import { useAuthStore } from '../store/useAuthStore';
import { LoaderIcon } from 'react-hot-toast';

export default function SignUpPage() {
  const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:""
  });

  const signup=useAuthStore((state)=>state.signup);
  const isSigningUp=useAuthStore((state)=>state.isSigningUp);
  const isGoogleLogin=useAuthStore((state)=>state.isGoogleLogin);

  const handleSubmit=(e)=>{
    e.preventDefault();
    signup(formData);
  }

  return (
    <div className='min-h-screen flex justify-center items-center bg-lime-50 px-4'>
        <div className='max-w-6xl w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl min-h-[90vh] md:min-h-[70vh] lg:min-h-[90vh] flex'>
            {/* Left section */}
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-4'>
                <div className='mb-8'>
                  <h1 className='text-4xl font-bold text-center text-lime-800 mt-8 mb-2'>Create your Devloop Account</h1>
                  <h2 className='mt-2 text-center font-medium text-lime-600 text-xl mb-4'>Build projects. Find Collaboration. Grow in Public</h2>
                </div>
                <form className='w-full' onSubmit={handleSubmit}>
                  {/* username */}
                  <label htmlFor='username' className='auth-input-label'>Username</label>
                  <div className='relative mb-3'>
                    <CircleUserRound className="auth-input-icon"/>
                    <input type='text' className='input' id='username' placeholder='Furious004' value={formData.username} onChange={(e)=>setFormData({...formData,username:e.target.value})}/>
                  </div>
                  {/* email */}
                  <label htmlFor='email' className='auth-input-label'>Email</label>
                  <div className='relative mb-3'>
                    <MailIcon className="auth-input-icon" />
                    <input type='email' className='input' id='email' placeholder='johndoe@gmail.com' value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
                  </div>
                  {/* password */}
                  <label htmlFor='password' className='auth-input-label'>Password</label>
                  <div className='relative mb-3'>
                    <LockIcon className="auth-input-icon" />
                    <input type='password' className='input' id='password' placeholder='Enter your password' value={formData.password} onChange={(e)=>setFormData({...formData,password:e.target.value})}/>
                  </div>
                  <button className='auth-btn' type='submit' disabled={isSigningUp || isGoogleLogin}>
                    {isSigningUp?<LoaderIcon className='size-8 animate-spin mx-auto'/>:"Create Account"}
                  </button>
                </form>
                <div className='mt-5 text-gray-600'>
                  Already have an account?
                  <Link to="/login" className='text-lime-400'>Login</Link>
                </div>
                <div className='flex items-center gap-2 w-full px-4 mt-2'>
                  <div className='border-b w-[45%] border-slate-600'></div>
                  <div className='text-slate-600 text-lg'>or</div>
                  <div className='border-b w-[45%] border-slate-600'></div>
                </div>
                <GoogleLoginComp/>
            </div>
            {/* right Section */}
            <div className='hidden md:block md:w-1/2  relative bg-lime-600 rounded-r-2xl p-4'>
              {/* <div className='absolute inset-0 bg-lime-900/25 rounded-r-2xl'></div> */}
              <div className='h-full w-full flex flex-col justify-center items-center'>
                <div className='h-[70%]'>
                  <img src='./signup.png' alt='signup image' className='w-full h-full'/>
                </div>
                <h2 className='text-3xl font-bold text-center'>Code together.<span className="text-lime-200"> Grow Faster.</span></h2>
                <h4 className='text-white text-center font-medium text-lg'>Turn ideas into project with developers who care about building</h4>
              </div>
            </div>
        </div>
    </div>
  )
}
