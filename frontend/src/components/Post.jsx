import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from "react-router";
import { Loader, Trash, ThumbsUp, MessageCircle, Send, Clock, UserX, CircleCheckBig, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';

export default function Post({ post, authUser, onLike, onDelete, onComment, likeMutation, deleteMutation, commentMutation }) {
  const [open, setOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const isOwner = authUser._id === post.author._id;
  const isLiked = post.likes.includes(authUser._id);

  const isLikingPost = likeMutation.isPending && likeMutation.variables === post._id;
  const isDeletingPost = deleteMutation.isPending && deleteMutation.variables === post._id;

  const handleDeletePost = () => {
    setOpen(true);
  };

  const handleCreateComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment should have content");
      return;
    }
    console.log(newComment)
    onComment(newComment);
    setNewComment("");
  };

  const queryClient = useQueryClient();

  const { data: collabRequestStatus, isLoading } = useQuery({
    queryKey: ["collabStatus", post.project?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/collab/status/${post.project._id}`);
      return res.data;
    },
    enabled: !!post.project,
  });

  const { mutate: sendCollabRequest } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/collab/request/${post.project?._id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["collabStatus", post.project?._id] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    }
  });

  const handleSendCollabRequests = () => {
    if (!authUser.github) {
      toast.error("Link your github account for collaboration");
      return;
    }
    sendCollabRequest();
  }

  const renderButton = () => {
    if (isLoading) {
      return (
        <button className='flex justify-center items-center'>
          <Loader className='animate-spin' />
        </button>
      )
    }
    switch (collabRequestStatus?.message) {
      case "pending":
        return (
          <button className="flex items-center gap-2 hover:cursor-pointer text-sm lg:text-base" disabled>
            <Clock />
            <span>Pending</span>
          </button>
        )
      case "rejected":
        return (
          <button className="flex items-center gap-2 hover:cursor-pointer text-sm lg:text-base" disabled>
            <UserX />
            <span>Rejected</span>
          </button>
        )
      case "accepted":
        return (
          <button className="flex items-center gap-2 hover:cursor-pointer text-sm lg:text-base" disabled>
            <CircleCheckBig />
            <span>Accepted</span>
          </button>
        )
      default:
        return (
          <button className="flex items-center gap-2 hover:cursor-pointer text-sm lg:text-base" type='button' onClick={handleSendCollabRequests}>
            <Send />
            <span>Collab</span>
          </button>
        )
    }
  }
  return (
    <div className='bg-slate-100 p-4 mb-4 shadow rounded-lg'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${post?.author?._id}`} className='shrink-0'>
            <img src={post.author.profilePic || "./avatar.png"} className='size-12 rounded-full object-cover' alt='post author' />
          </Link>
          <div>
            <Link to={`/profile/${post?.author?._id}`}>
              <h3 className='font-semibold'>{post.author.username}</h3>
            </Link>
            <p className='text-sm text-slate-600 line-clamp-1'>{post.author.headline}</p>
            <p className='text-xs text-slate-600'>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        {isOwner && (
          <button className='text-red-500 hover:text-red-700 hover:cursor-pointer transition-colors' onClick={handleDeletePost} disabled={isDeletingPost}>
            {isDeletingPost ? <Loader className='animate-spin' /> : <Trash />}
          </button>
        )}
      </div>
      <p className='mb-4 text-sm lg:text-base'>{post.content}</p>
      {post.type === 'collab' && (
        <div className='mb-4 space-y-4'>
          <div>
            <p className='text-base lg:text-lg font-semibold text-slate-900 tracking-tight'>{post.project.title}</p>
            <p className='text-sm text-slate-600 mt-1 line-clamp-4'>
              {post.project.dscription}
            </p>
          </div>
          <div className='flex flex-wrap gap-5 text-sm text-slate-600'>
            <span>
              <span className='font-medium text-slate-700 '>Collaborators:</span>&nbsp;{post.project.collaborators.length}
            </span>
            <span>
              <span className='font-medium text-slate-700 '>Roles Needed:</span>&nbsp;{post.project.rolesNeeded.length}
            </span>
          </div>
          <div>
            <p className='text-sm font-medium text-slate-700 mb-1'>Tech Stack</p>
            <div className='flex flex-wrap gap-2'>
              {post.project.techStack.map((stack, index) => (
                <span className='text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium' key={index}>{stack}</span>
              ))}
            </div>
          </div>
          <div>
            <p className='text-sm font-medium text-slate-700 mb-1'>Roles Needed</p>
            <div className='flex flex-wrap gap-2'>
              {post.project.rolesNeeded.map((role, index) => (
                <span className='text-xs px-3 py-1 rounded-full border border-green-300 text-green-700 font-medium bg-white' key={index}>{role}</span>
              ))}
            </div>
          </div>
          <div className="pt-1">
            <Link
              to={`/project/${post.project._id}`}
              className="
          inline-flex items-center gap-1.5 
          text-sm font-medium 
          text-green-600 
          hover:text-green-700 
          transition
        "
            >
              View project
              <ExternalLink size={16} />
            </Link>
          </div>

        </div>
      )}
      {post.image && <img src={post.image} alt='post content' className='w-full mb-4  object-cover' />}
      <div className='flex justify-around mb-4'>
        <button className="flex items-center gap-2 hover:cursor-pointer text-sm lg:text-base" onClick={onLike} disabled={isLikingPost}>
          <ThumbsUp className={isLiked ? "text-blue-500 fill-blue-300" : ""} />
          <span>Like ({post.likes.length})</span>
        </button>
        <button className="flex items-center gap-2 hover:cursor-pointer text-sm lg:text-base" onClick={() => setShowComments(prev => !prev)}>
          <MessageCircle />
          <span>Comment</span>
        </button>
        {post.type === "collab" && authUser._id !== post.project.ownerId && renderButton()}
      </div>
      {showComments &&
        <div className=''>
          <div className='overflow-y-auto max-h-70 space-y-4 mb-3'>
            {post.comments.map((comment) => (
              <div className='flex gap-2' key={comment._id}>
                <Link to={`/profile/${post?.author?._id}`} className='shrink-0'><img src={comment.user.profilePic || '/avatar.png'} alt={comment.user.username} className='size-12 rounded-full object-cover' /></Link>
                <div>
                  <div className='flex gap-2 items-center'>
                    <h3 className='font-medium'>{comment.user.username}</h3>
                    <p className='text-xs text-slate-600'>
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <p className='text-sm text-slate-600'>{comment.user.headline}</p>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form className='w-full flex' onSubmit={handleCreateComment}>
            <input placeholder='Add a comment...' value={newComment} onChange={(e) => setNewComment(e.target.value)} className='
              flex-1
              px-4 py-2
              text-sm
              bg-base-100
              border border-base-300
              rounded-full
            placeholder:text-gray-400
              focus:outline-none
              focus:ring-2
            focus:ring-green-400
              focus:border-transparent
              transition
              duration-200'/>
            <button className='p-4 bg-green-500 text-white rounded-lg ms-2 hover:cursor-pointer hover:bg-green-700 transition-colors' disabled={commentMutation.isPending}>
              {commentMutation.isPending ? <Loader className='animate-spin' /> : <Send size={18} />}
            </button>
          </form>
        </div>
      }
      {open &&
        <div className='modal modal-open'>
          <div className='modal-box relative'>
            <h3 className='font-semibold text-lg mb-4'>Are you sure you want to delete?</h3>
            <div className='modal-action'>
              <button type='button' className='btn btn-success' onClick={() => { setOpen(false); onDelete() }}>Yes</button>
              <button className='btn' type='button' onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
