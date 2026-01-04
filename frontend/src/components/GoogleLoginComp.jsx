import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuthStore } from '../store/useAuthStore'
export default function GoogleLoginComp() {
    const googleLogin=useAuthStore((state)=>state.googleLogin);
    const handleSubmit=(credentialResponse)=>{
        googleLogin(credentialResponse.credential);
    }
    return (
        <div className='w-3/5 rounded-lg mt-5'>
            <GoogleLogin
                onSuccess={credentialResponse =>handleSubmit(credentialResponse)}
                onError={() => {
                    console.log('Login Failed');
                }}
            />;
        </div>
    )
}
