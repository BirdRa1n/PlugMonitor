import useSystem from "@/hooks/useSystem";

export default function SafeArea({
    children,
}: {
    children: React.ReactNode;
}) {
    const { platform } = useSystem();
    return (
        <div className={`${platform === "darwin" && `mt-5`} w-full h-full`}>
            {children}
        </div>
    );
}
