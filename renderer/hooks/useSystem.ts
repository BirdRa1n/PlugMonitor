import { useEffect, useState } from "react";

const useSystem = () => {
    const [platform, setPlatform] = useState<string>("");

    useEffect(() => {
        window.ipc.getSystemInfo().then((systemInfo: any) => {
            setPlatform(systemInfo.platform);
        });
    }, []);

    return { platform };
};

export default useSystem;