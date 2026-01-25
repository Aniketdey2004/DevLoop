import React from 'react'
import { axiosInstance } from "../lib/axios.js";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import NotifyCard from '../components/NotifyCard.jsx';

export default function Notification() {

  const { data: notifications, isLoading, isSuccess } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      return res.data;
    },
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationIds) => {
      await axiosInstance.patch("/notifications/read", { notificationIds });
    },
  });

  useEffect(() => {
    if (isSuccess && notifications?.length > 0) {
      const readNotificationsIds = notifications.filter((notify) => !notify.read).map((notify) => notify._id);
      if (readNotificationsIds.length > 0) {
        markAsRead(readNotificationsIds);
      }
    }
  }, [isSuccess]);

  return (
    <div className='h-full w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:p-4'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar />
      </div>
      <div className='col-span-1 lg:col-span-3 overflow-hidden flex flex-col'>
        <div className='bg-slate-50 rounded-lg shadow p-6 overflow-y-auto hide-scrollbar h-full'>
          <h1 className=' text-xl lg:text-2xl font-bold mb-6'>Notifications</h1>
          {isLoading ? <p>Loading Notifications...</p> :
            notifications && notifications.length > 0 ? (
              <ul className='space-y-3'>
                {
                  notifications.map((notify) => (
                    <NotifyCard notify={notify}/>
                  ))
                }
              </ul>
            ) : <p>No notifications at the moment</p>}
        </div>
      </div>
    </div>
  )
}