import React from 'react'
import { axiosInstance } from "../lib/axios.js";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserCheck, UserRoundX, UserPlus, ThumbsUp, MessageCircle, ExternalLink, Trash2, Loader } from 'lucide-react';
import { Link } from "react-router";
import Sidebar from './Sidebar.jsx';
import { formatDistanceToNow } from "date-fns";

export default function Notification() {
  const queryClient = useQueryClient();

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

  const { mutate: deleteNotification} = useMutation({
    mutationFn: async (notificationId) => {
      const res = await axiosInstance.delete(`/notifications/${notificationId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("notifications");
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    }
  });

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className='text-blue-500' />;
      case "comment":
        return <MessageCircle className='text-green-500' />;
      case "follow":
        return <UserPlus className='text-purple-500' />;
      case "collabAccepted":
        return <UserCheck className='text-emerald-600' />;
      case "collabRejected":
        return <UserRoundX className='text-red-500' />;
      default:
        return null;
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          `${notification.relatedUser.username} liked your post`
        );
      case "comment":
        return (
          `${notification.relatedUser.username} commented on your post`
        );
      case "follow":
        return (
          `${notification.relatedUser.username} started following you`
        );
      case "collabAccepted":
        return (
          `${notification.relatedUser.username} accepted your collab request on the project`
        );
      case "collabRejected":
        return (
          `${notification.relatedUser.username} rejected your collab request on the project`
        );
      default:
        return null;
    }
  };

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost)
      return null;
    //include the post  link
    return (
      <Link to={'/'} className='flex items-center p-2 bg-gray-50 w-44 space-x-2 hover:bg-gray-100 transition-colors'>
        {relatedPost.image && <img src={relatedPost.image} alt='post image' className='size-10 object-cover rounded-md' />}
        {relatedPost.content && (
          <div className='flex-1 overflow-hidden'>
            <p className='text-sm text-gray-600 truncate'>{relatedPost.content}</p>
          </div>
        )}
        <ExternalLink size={14} className='text-gray-400' />
      </Link>
    )
  }

  const renderRelatedProject = (relatedProject) => {
    if (!relatedProject)
      return null;
    //include the project  link
    return (
      <Link to={'/'} className='flex items-center p-2 bg-gray-50 w-48 space-x-2 hover:bg-gray-100 transition-colors'>
        <div className='flex-1 overflow-hidden'>
          <p className='font-medium truncate'>{relatedProject.title}</p>
          <p className='text-xs text-gray-600 truncate'>{relatedProject.description}</p>
        </div>
        <ExternalLink size={14} className='text-gray-400' />
      </Link>
    )
  }
  return (
    <div className='h-full w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar />
      </div>
      <div className='col-span-1 lg:col-span-3 overflow-hidden flex flex-col'>
        <div className='bg-slate-50 rounded-lg shadow p-6 overflow-y-auto'>
          <h1 className='text-2xl font-bold mb-6'>Notifications</h1>
          {isLoading ? <p>Loading Notifications...</p> :
            notifications && notifications.length > 0 ? (
              <ul className='space-y-3'>
                {
                  notifications.map((notify) => (
                    <li key={notify._id} className={`bg-white border rounded-lg p-4 hover:shadow-md  hover:cursor-pointer transition-all ${!notify.read ? "border-green-500" : "border-gray-400"}`}>
                      <div className='flex items-start gap-3'>
                        {/* todo:link it to user page when clicking on image */}
                        <img src={notify.relatedUser.profilePic || './avatar.png'} alt='related user image' className='size-10 rounded-full shrink-0' />
                        <div className='flex-1'>
                          <div className="mb-2 flex items-center gap-2 flex-wrap">
                              {renderNotificationIcon(notify.type)}
                              <span className='text-sm md:text-base'>{renderNotificationContent(notify)}</span>
                          </div>
                          <p className='text-xs text-slate-600 mb-2'>
                              {formatDistanceToNow(new Date(notify.createdAt), { addSuffix: true })}
                          </p>
                          {renderRelatedPost(notify.relatedPost)}
                          {renderRelatedProject(notify.projectId)}
                        </div>
                        <button className='text-red-500 hover:text-red-700 hover:cursor-pointer transition-colors' onClick={()=>deleteNotification(notify._id)} >
                          <Trash2 />
                        </button>
                      </div>
                    </li>
                  ))
                }
              </ul>
            ) : <p>No notifications at the moment</p>}
        </div>
      </div>
    </div>
  )
}
