'use client';

import { useRouter } from "next/navigation";
import Button from "./components/ui/Button/Button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-black">Welcome to Mini Trello!</h1>
      <Button style="bg-black text-white mt-4 font-bold text-1xl" onClick={() => {router.push('/boards')}}  title="GET STARTED"/>
    </div>
  );
}
