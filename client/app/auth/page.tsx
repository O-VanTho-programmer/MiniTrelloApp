'use client';

import { FaGithub, FaGoogle } from "react-icons/fa";
import Button from "../components/ui/Button/Button"
import { useState } from "react";
import { useSendCode, useSignIn } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AuthPage({ }) {
    const router = useRouter();

    const handleGoogleLogin = () => {
        const GG_CALLBACK_URL = "http://localhost:3000/auth/google/callback";
        const SCOPE = "openid email profile";

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${GG_CALLBACK_URL}&response_type=code&scope=${SCOPE}`;
    }

    const handleGithubLogin = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`
    }

    const [email, setEmail] = useState<string>("");
    const [openVerifyCode, setOpenVerifyCode] = useState<boolean>(false);
    const [inputCode, setInputCode] = useState<string>("");

    const sendCode = useSendCode();
    const signin = useSignIn();

    const handleSendCode = () => {
        if (!email) return;

        sendCode.mutate({ email }, {
            onSuccess: () => {
                alert("Code sent successfully");
                setOpenVerifyCode(true);
            }
        })
    }

    const handleSignin = () => {
        if (!email || !inputCode) return;

        signin.mutate({ email, code: inputCode }, {
            onSuccess: ({ data }) => {
                alert("Sign in successfully");
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                router.push("/boards");
            }
        })
    }

    return (
        <div className='bg-white min-h-screen flex items-center justify-center'>
            <div className='bg-white border rounded shadow py-8 px-14 sm:py-16 sm:px-21 flex flex-col gap-3'>
                {!openVerifyCode ? (
                    <>
                        <h2 className="text-3xl font-bold text-black text-center mb-5">Login</h2>

                        <label>Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border rounded" type="email" placeholder="Enter email" />
                        <Button
                            style='bg-black text-white justify-center'
                            title="Login"
                            onClick={handleSendCode} />

                        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
                            <Button icon={FaGithub} style="bg-black text-white" title="Login with Github" onClick={handleGithubLogin} />
                            <Button icon={FaGoogle} style="bg-red-500 text-white" title="Login with Google" onClick={handleGoogleLogin} />

                        </div>
                        <a href="/auth/signup" className="text-center text-gray-600 hover:text-gray-500">Signup with Email</a>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-black text-center mb-5">CODE SENT</h2>
                        <label>Enter your code</label>
                        <input value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="p-3 border rounded" type="text" placeholder="Enter code" />
                        <Button
                            style='bg-black text-white justify-center'
                            title="Sign Up"
                            onClick={handleSignin} />
                    </>
                )}

            </div>
        </div>
    )
}