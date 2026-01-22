import React from 'react'
import { Link } from 'react-router';
import { Bell , Waypoints, PanelsTopLeft} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';


export default function Sidebar() {
    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(["authUser"]);
    const {data:followers}=useQuery({
        queryKey:["followers"],
        queryFn:async()=>{
            const res=await axiosInstance.get("/users/followers");;
            return res.data;
        }
    });
    return (
    <div className='bg-slate-50 rounded-lg shadow'>
        <div className='p-4 text-center'>
            <div className='h-16 rounded-t-lg bg-cover bg-center'
                style={{backgroundImage:`url("${authUser.bannerImg || "./banner.png"}")`}}
            />
            <Link to={`/profile/${authUser._id}`}>
                <img src={authUser.profilePic || "./avatar.png"} alt={authUser.username} className='w-20 h-20 rounded-full mt-[-40px] mx-auto'/>
                <h2 className='text-xl font-semibold mt-2'>{authUser.username}</h2>
            </Link>
            <p className='text-slate-600'>{authUser.headline}</p>
            <p className='text-slate-600 text-xs mt-2'>{followers?.length} followers</p>
        </div>
        <div className=' py-4 border-t border-slate-400'>
            <div className='mb-2 hover:bg-slate-100 px-4 py-1 cursor-pointer'>
                <Link to="/notifications" className='flex items-center gap-2'>
                    <Bell className='inline-block'/>
                    <span className='text-lg '>Notifications</span>
                </Link>
            </div>
            <div className='mb-2 px-4 hover:bg-slate-100 px-4 py-1 cursor-pointer'>
                <Link to="/network" className='flex items-center gap-2'>
                    <Waypoints className='inline-block '/>
                    <span className='text-lg '>My Network</span>
                </Link>
            </div>
            <div className='mb-2 px-4 hover:bg-slate-100 px-4 py-1 cursor-pointer'>
                <Link to="/project" className='flex items-center gap-2'>
                    <PanelsTopLeft className='inline-block'/>
                    <span className='text-lg '>My projects</span>
                </Link>
            </div>
        </div>
    </div>
  )
}
