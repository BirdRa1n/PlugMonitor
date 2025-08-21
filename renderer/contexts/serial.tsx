import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SerialContextType {
    port: string | null;
    isConnected: boolean;
    availablePorts: string[];
    receivedData: string | null;
    connect: (portPath: string) => Promise<void>;
    disconnect: () => Promise<void>;
    sendData: (data: string) => Promise<void>;
}

const SerialContext = createContext<SerialContextType>({
    port: null,
    isConnected: false,
    availablePorts: [],
    receivedData: null,
    connect: async () => { },
    disconnect: async () => { },
    sendData: async () => { },
});

export const useSerial = () => useContext(SerialContext);

interface SerialProviderProps {
    children: ReactNode;
}

export const SerialProvider = ({ children }: SerialProviderProps) => {
    const [port, setPort] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [availablePorts, setAvailablePorts] = useState<string[]>([]);
    const [receivedData, setReceivedData] = useState<string | null>(null);

    useEffect(() => {
        // Lista as portas disponíveis ao montar o componente
        const listPorts = async () => {
            try {
                const ports = await window.ipc.listSerialPorts();
                setAvailablePorts(ports.map((p: any) => p.path));
            } catch (error) {
                console.error('Erro ao listar portas seriais:', error);
            }
        };
        listPorts();
    }, []);

    useEffect(() => {
        // Escutar dados recebidos da porta serial
        const unsubscribe = window.ipc.onSerialData((data: string) => {
            setReceivedData(data);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const connect = async (portPath: string) => {
        try {
            const result = await window.ipc.connectSerialPort(portPath, { baudRate: 115200 });
            if (result.success) {
                setIsConnected(true);
                setPort(portPath);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Erro ao conectar à porta serial:', error);
            setIsConnected(false);
            setPort(null);
            throw error;
        }
    };

    const disconnect = async () => {
        if (port) {
            try {
                await window.ipc.disconnectSerialPort();
                setIsConnected(false);
                setPort(null);
                setReceivedData(null);
            } catch (error) {
                console.error('Erro ao desconectar da porta serial:', error);
                throw error;
            }
        }
    };

    const sendData = async (data: string) => {
        if (!port || !isConnected) {
            throw new Error('Nenhuma porta serial conectada');
        }
        try {
            await window.ipc.sendSerialData(data);
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            throw error;
        }
    };

    return (
        <SerialContext.Provider
            value={{
                port,
                isConnected,
                availablePorts,
                receivedData,
                connect,
                disconnect,
                sendData,
            }}
        >
            {children}
        </SerialContext.Provider>
    );
};