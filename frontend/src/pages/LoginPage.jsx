import React from 'react'
import {CircleUserRound,LockIcon} from 'lucide-react';
import {Link} from "react-router";
export default function LoginPage() {
  return (
    <div className='min-h-screen flex justify-center items-center bg-lime-50 px-4'>
            <div className='max-w-6xl w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl min-h-[90vh] md:min-h-[70vh] lg:min-h-[90vh] flex'>
                {/* Left section */}
                <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-4'>
                    <div className='mb-8'>
                      <h1 className='text-4xl font-bold text-center text-lime-800 mt-8 mb-2'>Welcome Back, Developer</h1>
                      <h2 className='mt-2 text-center font-medium text-lime-600 text-xl mb-4'>Continue building where you left off</h2>
                    </div>
                    <form className='w-full'>
                      {/* username */}
                      <label htmlFor='username' className='auth-input-label'>Username</label>
                      <div className='relative mb-3'>
                        <CircleUserRound className="auth-input-icon"/>
                        <input type='text' className='input' id='username' placeholder='Furious004'/>
                      </div>
                      {/* password */}
                      <label htmlFor='password' className='auth-input-label'>Password</label>
                      <div className='relative mb-3'>
                        <LockIcon className="auth-input-icon" />
                        <input type='password' className='input' id='password' placeholder='Enter your password'/>
                      </div>
                      <button className='auth-btn'>
                        Sign In
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
                    {/* todo:Google or github login with oAuth system */}
                </div>
                {/* right Section */}
                <div className='hidden md:block md:w-1/2  relative bg-gradient-to-br from-lime-400 to-lime-600 rounded-r-2xl p-4'>
                  <div className='absolute inset-0 bg-lime-900/25 rounded-r-2xl'></div>
                  <div className='h-full w-full flex flex-col justify-center items-center'>
                    <div className='h-[70%]'>
                      <img src='./login.png' alt='login image' className='w-full h-full'/>
                    </div>
                    <h2 className='text-3xl font-bold text-center'>Your projects are waiting</h2>
                    <h4 className='text-lime-100 text-center font-medium text-lg'>Reconnect with your network and keep shipping meaningful work</h4>
                  </div>
                </div>
            </div>
        </div>
  )
}
