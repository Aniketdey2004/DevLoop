import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

export default function NotFound () {
    return (
        <div className='min-h-screen flex items-center justify-center bg-base-200 px-4'>
            <div className='card bg-base-100 border shadow-md max-w-md w-full'>
                <div className='card-body items-center text-center gap-4'>
                    <div className='bg-emerald-100 text-emerald-600 p-4 rounded-full'>
                        <AlertTriangle size={40} />
                    </div>
                    <h1 className='text-3xl font-bold text-slate-800'>
                        404
                    </h1>
                    <p className='text-lg font-semibold text-slate-700'>
                        Page not found
                    </p>
                    <p className='text-sm text-slate-500'>
                        The page you’re looking for doesn’t exist or may have been moved.
                    </p>
                    <div className="flex gap-3 mt-4">
                        <Link to="/" className="btn btn-success btn-sm gap-2">
                            <Home size={16} />
                            Go to Feed
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="btn btn-outline btn-sm gap-2"
                        >
                            <ArrowLeft size={16} />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
