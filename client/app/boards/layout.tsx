import { UserProvider } from "@/provider/UserProvider";
import HeaderBar from "../components/board/HeaderBar";
import { Toaster } from "react-hot-toast";

export default function BoardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <UserProvider>
            <Toaster position="top-center" />
            <div className={`h-screen`}>
                <HeaderBar />
                {children}
            </div>
        </UserProvider>
    );
}
