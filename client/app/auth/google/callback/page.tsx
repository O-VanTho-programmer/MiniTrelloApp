'use client';
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

export default function GithubCallbackPage() {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const router = useRouter();


    useEffect(() => {
        const fetchAccessToken = async () => {
            if (!code) {
                alert("No code");
                router.push("/auth");
            }

            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google`, { code })

                const { token, user } = res.data;

                if (token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                }

                router.push("/boards");
            } catch (error) {
                alert("Error getting access token from Google");
                router.push("/auth");
            }
        };

        fetchAccessToken();
    }, [code])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <FaSpinner className="animate-spin text-4xl mb-4 text-blue-500" />
            <h2 className="text-xl font-semibold">Authenticating with Google...</h2>
            <p className="text-gray-400 mt-2">Please wait while we log you in</p>
        </div>
    )
}