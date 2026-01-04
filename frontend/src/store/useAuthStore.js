import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAuthStore=create((set,get)=>({
    authUser:null,
    isCheckingAuth:true,
    isSigningUp:false,
    isLoggingIn:false,
    isGoogleLogin:false,
    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/auth/me");
            set({authUser:res.data});
        } catch (error) {
            console.log("User is not authenticated",error.response.data.message);
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
    signup:async(userData)=>{
        set({isSigningUp:true});
        try {
            if(!userData.username.trim() || !userData.email.trim() || !userData.password.trim()){
                toast.error("Please fill all fields");
                return;
            }
            const res=await axiosInstance.post("/auth/signup",userData);
            set({isSigningUp:false});
            set({authUser:res.data});
        } catch (error) {
            console.log("Error in signing up",error.response.data.message);
            toast.error(error.response.data.message);
            set({isSigningUp:false});
        }
    },
    login:async(userData)=>{
        set({isLoggingIn:true})
        try {
            if(!userData.email.trim() || !userData.password.trim()){
                toast.error("Please fill all fields");
                return;
            }
            const res=await axiosInstance.post("/auth/login",userData);
            set({isLoggingIn:false});
            set({authUser:res.data});
        } catch (error) {
            console.log("Error in login",error.response.data.message);
            toast.error(error.response.data.message);
            set({isLoggingIn:false});
        }
    },
    googleLogin:async(token)=>{
        set({isGoogleLogin:true});
        try {
            const authUser=get().authUser;
            if(authUser)
            {
                toast.error("You are already signed in");
                return;
            }
            const res=await axiosInstance.post("/auth/google",{token});
            set({isGoogleLogin:false});
            set({authUser:res.data});
        } catch (error) {
            console.log("Error in google login");
            toast.error(error.response.data.message);
            set({isGoogleLogin:false});
        }
    }
}))