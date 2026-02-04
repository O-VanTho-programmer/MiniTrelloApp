'use client';

import { FaGithub, FaGoogle } from "react-icons/fa";
import Button from "../components/ui/Button/Button"

export default function AuthPage({ }) {
    const handleGoogleLogin = () => {
        const GG_CALLBACK_URL = "http://localhost:3000/auth/google/callback";
        const SCOPE = "openid email profile";

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${GG_CALLBACK_URL}&response_type=code&scope=${SCOPE}`;
    }

    const handleGithubLogin = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`
    }

    return (
        <div className='bg-white min-h-screen flex items-center justify-center'>
            <div className='bg-white border rounded shadow py-16 px-21 flex flex-col gap-3'>
                <h2 className="text-3xl font-bold text-black text-center mb-5">Login</h2>
                <Button icon={FaGithub} style="bg-black text-white" title="Login with Github" onClick={handleGithubLogin}/>
                <Button icon={FaGoogle} style="bg-red-500 text-white" title="Login with Google" onClick={handleGoogleLogin}/>
            </div>
        </div>
    )
}