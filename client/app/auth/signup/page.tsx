'use client';
import Button from '@/app/components/ui/Button/Button';
import { useSendCode, useSignUp } from '@/hooks/useAuth';
import { sendCode } from '@/services/auth';
import { useRouter } from 'next/router';
import { useState } from 'react'


function signupPage() {

    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [openVerifyCode, setOpenVerifyCode] = useState<boolean>(false);
    const [inputCode, setInputCode] = useState<string>("");

    const sendCode = useSendCode();
    const signup = useSignUp();

    const handleSignup = async () => {
        if (!name || !email) return;

        sendCode.mutate({ email }, {
            onSuccess: () => {
                alert("Code sent successfully");
                setOpenVerifyCode(true);
            }
        })
    }

    const handleCheckCode = () => {
        if (inputCode) {
            signup.mutate({ name, email, code: inputCode }, {
                onSuccess: ({data}) => {
                    alert("Sign up successfully");
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    router.push("/boards");
                }
            })
        }
    }

    return (
        <div className='bg-white min-h-screen flex items-center justify-center'>
            <div className='bg-white border rounded shadow py-16 px-21 flex flex-col gap-3'>

                {!openVerifyCode ? (
                    <>
                        <h2 className="text-3xl font-bold text-black text-center mb-5">Sign Up</h2>
                        <label>Username</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="p-3 border rounded" type="text" placeholder="Enter username" />

                        <label>Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border rounded" type="email" placeholder="Enter email" />

                        <Button
                            style='bg-black text-white justify-center'
                            title="Sign Up"
                            onClick={handleSignup} />
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-black text-center mb-5">CODE SENT</h2>
                        <label>Enter your code</label>
                        <input value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="p-3 border rounded" type="text" placeholder="Enter code" />
                        <Button
                            style='bg-black text-white justify-center'
                            title="Sign Up"
                            onClick={handleCheckCode} />
                    </>
                )}
            </div>
        </div>
    )
}

export default signupPage