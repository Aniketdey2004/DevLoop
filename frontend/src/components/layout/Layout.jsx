import React, { Children } from 'react'
import Navbar from './Navbar'

export default function Layout({children}) {
  return (
    <div className='bg-base-100 min-h-screen'>
        <Navbar/>
        <main className='max-w-7xl mx-auto px-4 py-6'>{children}</main>
    </div>
  )
}
