import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from "date-fns";
import { UserCheck, UserRoundX, UserPlus, ThumbsUp, MessageCircle, ExternalLink, Trash2, Loader } from 'lucide-react';
import { Link } from "react-router";

export default function NotifyCard({ notify }) {
    const queryClient = useQueryClient();
    const { mutate: deleteNotification , isPending:isDeletingNotification} = useMutation({
        mutationFn: async (notificationId) => {
            const res = await axiosInstance.delete(`/notifications/${notificationId}`);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey:["notifications"]});
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });

    const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className='text-blue-500' size={18}/>;
      case "comment":
        return <MessageCircle className='text-green-500' size={18}/>;
      case "follow":
        return <UserPlus className='text-purple-500' size={18}/>;
      case "collabAccepted":
        return <UserCheck className='text-emerald-600' size={18}/>;
      case "collabRejected":
        return <UserRoundX className='text-red-500' size={18}/>;
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
    return (
      <Link to={`/posts/${relatedPost._id}`} className='flex items-center p-2 bg-gray-50 w-44 space-x-2 hover:bg-gray-100 transition-colors'>
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
      return (
        <Link to={`/project/${relatedProject._id}`} className='flex items-center p-2 bg-gray-50 w-48 space-x-2 hover:bg-gray-100 transition-colors'>
          <div className='flex-1 overflow-hidden'>
            <p className='font-medium truncate'>{relatedProject.title}</p>
          </div>
          <ExternalLink size={14} className='text-gray-400' />
        </Link>
      )
    }

    return (
        <li key={notify._id} className={`bg-white border rounded-lg p-4 hover:shadow-md  hover:cursor-pointer transition-all ${!notify.read ? "border-green-500" : "border-gray-400"}`}>
            <div className='flex items-start gap-2 lg:gap-3'>
                <Link to={`/profile/${notify.relatedUser._id}`} className='shrink-0'><img src={notify.relatedUser.profilePic || '/avatar.png'} alt='related user image' className='size-10 rounded-full  object-cover' /></Link>
                <div className='flex-1'>
                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                        {renderNotificationIcon(notify.type)}
                        <span className='text-sm md:text-base'>{renderNotificationContent(notify)}</span>
                    </div>
                    <p className='text-xs text-slate-600 mb-2'>
                        {formatDistanceToNow(new Date(notify.createdAt), { addSuffix: true })}
                    </p>
                    {notify.relatedPost && renderRelatedPost(notify.relatedPost)}
                    {notify.relatedProject && renderRelatedProject(notify.projectId)}
                </div>
                <button className='text-red-500 hover:text-red-700 hover:cursor-pointer transition-colors' onClick={() => deleteNotification(notify._id)} >
                    {isDeletingNotification?<Loader className='animate-spin'/>:<Trash2 />}
                </button>
            </div>
        </li>
    )
}
