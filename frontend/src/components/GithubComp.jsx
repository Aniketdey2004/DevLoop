import React from 'react';
import { Github } from 'lucide-react';

export default function GithubComp({ userData, isOwnProfile }) {

    const handleGithubRedirect = () => {
        window.location.href = "http://localhost:8080/api/v1/auth/github";
    }

    return (
        <div className='mb-6 px-4 flex flex-col gap-4'>
            {userData.github && (
                <>
                    <div className="flex items-center gap-2">
                        <Github className="w-6 h-6" />
                        <span className="text-2xl font-semibold">GitHub:</span>
                        <span className="text-2xl text-gray-700">
                            {userData.github?.username}
                        </span>
                    </div>
                    <a
                        href={userData.github.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-fit bg-green-500 text-white py-2 px-6 rounded-full font-medium transition hover:bg-green-600 shadow-md"
                    >
                        View Profile
                    </a>
                </>
            )}
            {isOwnProfile && !userData.github && (
                <button onClick={handleGithubRedirect} className='inline-block w-fit bg-green-500 text-white py-2 px-4 rounded-full transition hover:bg-green-700 cursor-pointer'>
                    Link Github
                </button>
            )}

        </div>
    )
}
