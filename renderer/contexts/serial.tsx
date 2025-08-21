import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SerialContextType {
    port: string | null;
    isConnected: boolean;
    availablePorts: string[];
    receivedData: string;
    mainsV: number;
    pf: number;
    sensVPerA: number;
    irms: number;
    powerW: number;
    energyKWh: number;
    statusMessage: string;
    connect: (portPath: string) => Promise<void>;
    disconnect: () => Promise<void>;
    sendData: (data: string) => Promise<void>;
    setVoltage: (value: number) => Promise<void>;
    setPowerFactor: (value: number) => Promise<void>;
    setSensitivity: (value: number) => Promise<void>;
    getConfig: () => Promise<void>;
}

const SerialContext = createContext<SerialContextType>({
    port: null,
    isConnected: false,
    availablePorts: [],
    receivedData: '',
    mainsV: 220.0,
    pf: 0.90,
    sensVPerA: 0.100,
    irms: 0,
    powerW: 0,
    energyKWh: 0,
    statusMessage: '',
    connect: async () => { },
    disconnect: async () => { },
    sendData: async () => { },
    setVoltage: async () => { },
    setPowerFactor: async () => { },
    setSensitivity: async () => { },
    getConfig: async () => { },
});

export const useSerial = () => useContext(SerialContext);

interface SerialProviderProps {
    children: ReactNode;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SerialProvider = ({ children }: SerialProviderProps) => {
    const [port, setPort] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [availablePorts, setAvailablePorts] = useState<string[]>([]);
    const [receivedData, setReceivedData] = useState<string>('');
    const [dataBuffer, setDataBuffer] = useState<string>('');
    const [mainsV, setMainsV] = useState<number>(220.0);
    const [pf, setPf] = useState<number>(0.90);
    const [sensVPerA, setSensVPerA] = useState<number>(0.100);
    const [irms, setIrms] = useState<number>(0);
    const [powerW, setPowerW] = useState<number>(0);
    const [energyKWh, setEnergyKWh] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState<string>('');

    useEffect(() => {
        // Lista as portas disponíveis ao montar o componente
        const listPorts = async () => {
            try {
                const ports = await window.ipc.listSerialPorts();
                setAvailablePorts(ports.map((p: any) => p.path));
            } catch (error) {
                console.error('Erro ao listar portas seriais:', error);
                setStatusMessage('Erro ao listar portas');
            }
        };
        listPorts();
    }, []);

    useEffect(() => {
        // Escutar dados recebidos da porta serial
        const unsubscribe = window.ipc.onSerialData((data: string) => {
            setDataBuffer((prev) => prev + data);
            setReceivedData((prev) => prev + data);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        // Chama getConfig quando a conexão é estabelecida
        if (isConnected && port) {
            getConfig();
        }
    }, [isConnected, port]);

    useEffect(() => {
        // Processa o buffer sempre que muda, parseando linhas completas
        if (dataBuffer) {
            const lines = dataBuffer.split('\n');
            let remainingBuffer = '';
            if (!dataBuffer.endsWith('\n')) {
                remainingBuffer = lines.pop() || '';
            }
            lines.forEach((line) => {
                if (line.trim()) {
                    parseLine(line);
                }
            });
            setDataBuffer(remainingBuffer);
        }
    }, [dataBuffer]);

    const parseLine = (line: string) => {
        console.log('Received line:', line); // Debug log
        const measurementRegex = /I_RMS:\s*([\d.]+)\s*A\s*\|\s*P:\s*([\d.]+)\s*W\s*\|\s*E:\s*([\d.]+)\s*kWh/;
        const matchMeasurement = line.match(measurementRegex);
        if (matchMeasurement) {
            setIrms(parseFloat(matchMeasurement[1]));
            setPowerW(parseFloat(matchMeasurement[2]));
            setEnergyKWh(parseFloat(matchMeasurement[3]));
            return;
        }

        if (line.startsWith('>OK,')) {
            setStatusMessage(`Sucesso: ${line.substring(4)}`);
        } else if (line.startsWith('>ERROR,')) {
            const errorMsg = line.substring(7);
            setStatusMessage(`Erro: ${errorMsg}`);
            console.warn('Device error:', errorMsg);
        } else if (line.startsWith('>CONFIG,')) {
            const configRegex = />CONFIG,V=([\d.]+),PF=([\d.]+),SENS=([\d.]+)/;
            const matchConfig = line.match(configRegex);
            if (matchConfig) {
                setMainsV(parseFloat(matchConfig[1]));
                setPf(parseFloat(matchConfig[2]));
                setSensVPerA(parseFloat(matchConfig[3]));
                setStatusMessage('Configurações atualizadas');
            } else {
                console.warn('Invalid CONFIG response:', line);
            }
        } else {
            console.warn('Unrecognized line:', line);
        }
    };

    const clearBuffer = async () => {
        try {
            await window.ipc.sendSerialData('>CLEAR\r\n');
            await delay(100);
        } catch (error) {
            console.error('Erro ao limpar buffer:', error);
        }
    };

    const connect = async (portPath: string) => {
        try {
            const result = await window.ipc.connectSerialPort(portPath, { baudRate: 115200 });
            if (result.success) {
                setIsConnected(true);
                setPort(portPath);
                await clearBuffer(); // Clear buffer on connect
            } else {
                throw new Error(result.message);
            }
        } catch (error: any) {
            console.error('Erro ao conectar à porta serial:', error);
            setIsConnected(false);
            setPort(null);
            setStatusMessage(`Erro ao conectar: ${error.message}`);
            throw error;
        }
    };

    const disconnect = async () => {
        if (port) {
            try {
                await window.ipc.disconnectSerialPort();
                setIsConnected(false);
                setPort(null);
                setReceivedData('');
                setDataBuffer('');
                setIrms(0);
                setPowerW(0);
                setEnergyKWh(0);
                setStatusMessage('');
            } catch (error) {
                console.error('Erro ao desconectar da porta serial:', error);
                setStatusMessage('Erro ao desconectar');
                throw error;
            }
        }
    };

    const sendData = async (data: string) => {
        if (!port || !isConnected) {
            throw new Error('Nenhuma porta serial conectada');
        }
        try {
            await window.ipc.sendSerialData(data + '\r\n'); // Use \r\n for compatibility
            setStatusMessage(`Enviado: ${data}`);
            await delay(100); // Wait after sending
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            setStatusMessage('Erro ao enviar');
            throw error;
        }
    };

    const setVoltage = async (value: number) => {
        await clearBuffer();
        await sendData(`>SET_V,${value.toFixed(1)}`);
    };

    const setPowerFactor = async (value: number) => {
        await clearBuffer();
        await sendData(`>SET_PF,${value.toFixed(2)}`);
    };

    const setSensitivity = async (value: number) => {
        await clearBuffer();
        await sendData(`>SET_SENS,${value.toFixed(3)}`);
    };

    const getConfig = async () => {
        await clearBuffer();
        await sendData('>GET_CONFIG');
    };

    return (
        <SerialContext.Provider
            value={{
                port,
                isConnected,
                availablePorts,
                receivedData,
                mainsV,
                pf,
                sensVPerA,
                irms,
                powerW,
                energyKWh,
                statusMessage,
                connect,
                disconnect,
                sendData,
                setVoltage,
                setPowerFactor,
                setSensitivity,
                getConfig,
            }}
        >
            {children}
        </SerialContext.Provider>
    );
};