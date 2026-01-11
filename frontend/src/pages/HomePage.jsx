import React from 'react'
import { Outlet } from 'react-router';
import { House, Settings2, User, Bell, Waypoints, PanelsTopLeft } from 'lucide-react';
import { Link } from 'react-router';
import { axiosInstance } from "../lib/axios.js";
import { useQuery } from '@tanstack/react-query';
export default function HomePage() {

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      return res.data;
    },

  });

  const unreadNotificationsCount = notifications?.filter((notify) => !notify.read).length;

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
            {/* Sidebar toggle icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-6 text-emerald-500"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
          </label>
          <div className="px-4">
            <img src='./logo.svg' />
          </div>
        </nav>
        {/* Page content here */}
        <div className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            <Link to="/">
              <li className='mt-3'>
                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Feed">
                  <House />
                  <span className="is-drawer-close:hidden text-xl">Feed</span>
                </button>
              </li>
            </Link>
            <Link to="/profile">
              <li className='mt-8'>
                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Profile">
                  <User />
                  <span className="is-drawer-close:hidden text-xl">Profile</span>
                </button>
              </li>
            </Link>
            <Link to="/notifications">
              <li className='mt-8'>
                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Notification">
                  <Bell />
                  <span className="is-drawer-close:hidden text-xl">Notifications</span>
                  {unreadNotificationsCount!==undefined && unreadNotificationsCount>0 && <div className="badge badge-success is-drawer-close:hidden">+ {unreadNotificationsCount}</div>}
                </button>
              </li>
            </Link>
            <Link to="/network">
              <li className='mt-8'>
                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Network">
                  <Waypoints />
                  <span className="is-drawer-close:hidden text-xl">Network</span>
                </button>
              </li>
            </Link>
            <Link to="/project">
              {/* if possible implement the same as notifications here also */}
              <li className='mt-8'>
                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Project">
                  <PanelsTopLeft />
                  <span className="is-drawer-close:hidden text-xl">Project</span>
                </button>
              </li>
            </Link>
            <Link to={"/settings"}>
              <li className='mt-8'>
                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
                  <Settings2 />
                  <span className="is-drawer-close:hidden text-xl">Settings</span>
                </button>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  )
}
