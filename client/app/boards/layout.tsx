import HeaderBar from "../components/board/HeaderBar";

export default function BoardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={``}>
            <HeaderBar/>
            {children}
        </div>
    );
}
