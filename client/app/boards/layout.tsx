import { UserProvider } from "@/provider/UserProvider";
import HeaderBar from "../components/board/HeaderBar";

export default function BoardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <UserProvider>
            <div className={`h-screen`}>
                <HeaderBar />
                {children}
            </div>
        </UserProvider>
    );
}
