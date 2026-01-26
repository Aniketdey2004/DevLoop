import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Loader, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DiscussionPanel() {
    const { projectId } = useParams();
    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(["authUser"]);
    const [newMessage, setNewMessage] = useState("");

    const { data: messages } = useQuery({
        queryKey: ["discussions", projectId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/discussions/${projectId}`);
            return res.data;
        }
    });

    const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
        mutationFn: async (message) => {
            const res = await axiosInstance.post(`/discussions/${projectId}`, { message });
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["discussions", projectId] });
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response.data.message);
        }
    });

    const msgRef = useRef(null);
    useEffect(() => {
        if (msgRef.current != null) {
            msgRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    const handleSendMessage = () => {
        if (!newMessage.trim()) {
            toast.error("Please write something");
            return;
        }
        sendMessage(newMessage);
        setNewMessage("");
    };
    return (
        <div className='bg-white rounded-xl border border-slate-200 p-5 flex flex-col h-[700px]'>
            <h2 className='text-lg font-semibold text-slate-800 mb-4'>Project Discussion</h2>
            <div className='flex-1 overflow-y-auto space-y-4 pr-2'>
                {
                    messages && messages.map((message) => (
                        <div className='flex gap-1 md:gap-3' key={message._id}>
                            <Link to={`/profile/${message.sender._id}`} className='shrink-0'><img
                                src={message.sender.profilePic || './avatar.png'}
                                className="size-8 rounded-full object-cover"
                                alt="sender profilepic"
                            /></Link>
                            <div className="bg-slate-100 rounded-lg p-3 max-w-xl">
                                <p className="text-sm font-medium text-slate-700">
                                    {message.sender._id === authUser._id ? "You" : message.sender.username}
                                </p>
                                <p className="text-slate-600 text-sm">
                                    {message.message}
                                </p>
                                <p className='text-xs text-slate-600 mt-2'>
                                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    ))
                }
                <div ref={msgRef}></div>
            </div>
            <div className='p-2 lg:p-4 border-t flex gap-2'>
                <input type='text' placeholder="Share an update with collaborators…" value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} className='flex-1 bg-slate-100 rounded-lg px-2 md:px-4 py-2 border border-slate-700/50 focus:border-green-400 focus:ring-2 focus:ring-green-400
    focus:outline-none placeholder:text-sm'/>
                <button className='btn btn-success text-white bg-green-500 hover:bg-green-700 transition-colors' disabled={isSendingMessage} onClick={handleSendMessage}>
                    {isSendingMessage ? <Loader className='animate-spin' /> : <Send  />}
                </button>
            </div>
        </div>
    )
}
