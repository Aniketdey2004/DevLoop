import React from 'react'
import { LoaderIcon } from 'lucide-react'
export default function PageLoader() {
  return (
    <div className='min-h-screen bg-lime-50 flex justify-center items-center'>
        <LoaderIcon className='size-10 animate-spin text-lime-700'/>
    </div>
  )
}
