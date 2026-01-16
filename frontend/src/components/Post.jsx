import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from "react-router";
import { Loader, Trash, ThumbsUp, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";

export default function Post({ post, authUser, onLike, onDelete, onComment, likeMutation, deleteMutation, commentMutation }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const isOwner = authUser._id === post.author._id;
  const isLiked = post.likes.includes(authUser._id);

  const isLikingPost = likeMutation.isPending && likeMutation.variables === post._id;
  const isDeletingPost = deleteMutation.isPending && deleteMutation.variables === post._id;

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    onDelete();
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


  return (
    <div className='bg-slate-100 p-4 mb-4 shadow rounded-lg'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${post?.author?._id}`}>
            <img src={post.author.profilePic || "./avatar.png"} className='size-12 rounded-full' alt='post author' />
          </Link>
          <div>
            <Link to={`/profile/${post?.author?._id}`}>
              <h3 className='font-semibold'>{post.author.username}</h3>
            </Link>
            <p className='text-sm text-slate-600'>{post.author.headline}</p>
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
      <p className='mb-4'>{post.content}</p>
      {post.image && <img src={post.image} alt='post content' className='w-full mb-4 max-h-[40vh] object-cover' />}
      <div className='flex justify-around mb-4'>
        <button className="flex items-center gap-2 hover:cursor-pointer" onClick={onLike} disabled={isLikingPost}>
          <ThumbsUp className={isLiked ? "text-blue-500 fill-blue-300" : ""} />
          <span>Like ({post.likes.length})</span>
        </button>
        <button className="flex items-center gap-2 hover:cursor-pointer" onClick={() => setShowComments(prev => !prev)}>
          <MessageCircle />
          <span>Comment</span>
        </button>
        {/* todo:add a button for collab request */}
      </div>
      {showComments &&
        <div className=''>
          <div className='overflow-y-auto max-h-70 space-y-4 mb-3'>
            {post.comments.map((comment) => (
              <div className='flex gap-2' key={comment._id}>
                {/* todo:link the image to the profile page of user */}
                <img src={comment.user.profilePic || '/avatar.png'} alt={comment.user.username} className='size-12 rounded-full shrink-0' />
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

    </div>
  )
}
