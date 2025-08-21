import { useSerial } from '@/contexts/serial';
import useSystem from '@/hooks/useSystem';
import SafeArea from '@/layouts/safe-area';
import { Navbar, NavbarBrand } from '@heroui/react';
import { useEffect, useState } from 'react';
import DefaultLayout from '../layouts/default';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function HomePage() {
  const {
    connect,
    disconnect,
    sendData,
    setVoltage,
    setPowerFactor,
    setSensitivity,
    port,
    availablePorts,
    isConnected,
    receivedData,
    mainsV,
    pf,
    sensVPerA,
    irms,
    powerW,
    energyKWh,
    statusMessage,
  } = useSerial();

  const [localMainsV, setLocalMainsV] = useState(mainsV);
  const [localPf, setLocalPf] = useState(pf);
  const [localSens, setLocalSens] = useState(sensVPerA);
  const [selectedPort, setSelectedPort] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { platform } = useSystem();

  useEffect(() => {
    if (platform) {
      console.log('Platform:', platform);
    }
  }, [platform]);

  const handleConnect = async () => {
    if (selectedPort) {
      try {
        await connect(selectedPort);
      } catch (error) {
        console.error('Erro ao conectar:', error);
      }
    }
  };

  const handleSend = async () => {
    try {
      await sendData('Hello, Serial!');
    } catch (error) {
      console.error('Erro ao enviar teste:', error);
    }
  };

  const handleApplyConfig = async () => {
    try {
      await setVoltage(localMainsV);
      await delay(100);
      if (showAdvanced) {
        await setPowerFactor(localPf);
        await delay(100);
        await setSensitivity(localSens);
        await delay(100);
      }
    } catch (error: any) {
      console.error('Erro ao aplicar configurações:', error);
      // Note: statusMessage is updated in serial.tsx
    }
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <DefaultLayout>
      <SafeArea>
        <Navbar className={`bg-transparent ${platform === "darwin" && 'pt-5'}`} maxWidth='full'>
          {/* Header Section */}
          <NavbarBrand className='flex flex-col items-start w-full'>
            <h1 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white">Monitor de Energia</h1>
            <p className="text-sm text-[#86868b]">Monitoramento de energia elétrica em tempo real</p>
          </NavbarBrand>
        </Navbar>
        <div className="flex flex-col p-6 space-y-6 w-[100%] ">


          {/* Connection Status Card */}
          <div className="bg-white dark:bg-[#2c2c2e] rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-sm text-[#86868b]">Status: {isConnected ? 'Conectado' : 'Desconectado'}</p>
                </div>
                <p className="text-sm text-[#86868b]">Porta Atual: {port || 'Nenhuma'}</p>
              </div>
              <div>
                <select
                  value={selectedPort}
                  onChange={(e) => setSelectedPort(e.target.value)}
                  className="w-full p-2 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  disabled={isConnected}
                >
                  <option value="">Selecione uma porta</option>
                  {availablePorts.map((port) => (
                    <option key={port} value={port}>{port}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Device Configuration Card */}
          <div className="bg-white dark:bg-[#2c2c2e] rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-4">Configurações do Dispositivo</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[#86868b] mb-2 block">Voltagem Nominal (V)</label>
                <input
                  type="number"
                  value={localMainsV}
                  onChange={(e) => setLocalMainsV(parseFloat(e.target.value))}
                  className="w-full p-2 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg"
                  disabled={!isConnected}
                />
              </div>
              <div>
                <label className="text-sm text-[#86868b] mb-2 block">Corrente RMS (A)</label>
                <input
                  type="number"
                  value={irms.toFixed(3)}
                  className="w-full p-2 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg opacity-60"
                  disabled
                />
              </div>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="text-sm text-[#86868b] mb-2 block">Fator de Potência</label>
                  <input
                    type="number"
                    step="0.01"
                    value={localPf}
                    onChange={(e) => setLocalPf(parseFloat(e.target.value))}
                    className="w-full p-2 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg"
                    disabled={!isConnected}
                  />
                </div>
                <div>
                  <label className="text-sm text-[#86868b] mb-2 block">Sensibilidade (V/A)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={localSens}
                    onChange={(e) => setLocalSens(parseFloat(e.target.value))}
                    className="w-full p-2 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg"
                    disabled={!isConnected}
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleApplyConfig}
                disabled={!isConnected}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                Aplicar Configurações
              </button>
              <button
                onClick={toggleAdvanced}
                className="px-4 py-2 bg-[#e5e5ea] dark:bg-[#3a3a3c] text-[#1d1d1f] dark:text-white rounded-lg hover:bg-[#d1d1d6] transition-colors"
              >
                {showAdvanced ? 'Ocultar Avançado' : 'Mostrar Avançado'}
              </button>
            </div>
          </div>

          {/* Real-time Data Card */}
          <div className="bg-white dark:bg-[#2c2c2e] rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-4">Dados em Tempo Real</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#f5f5f7] dark:bg-[#3a3a3c] p-4 rounded-lg">
                <p className="text-sm text-[#86868b]">Corrente RMS</p>
                <p className="text-xl font-medium">{irms.toFixed(3)} A</p>
              </div>
              <div className="bg-[#f5f5f7] dark:bg-[#3a3a3c] p-4 rounded-lg">
                <p className="text-sm text-[#86868b]">Potência</p>
                <p className="text-xl font-medium">{powerW.toFixed(1)} W</p>
              </div>
              <div className="bg-[#f5f5f7] dark:bg-[#3a3a3c] p-4 rounded-lg">
                <p className="text-sm text-[#86868b]">Energia</p>
                <p className="text-xl font-medium">{energyKWh.toFixed(6)} kWh</p>
              </div>
            </div>
          </div>

          {/* Log Card */}
          <div className="bg-white dark:bg-[#2c2c2e] rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium mb-4">Log de Dados</h2>
            <textarea
              className="w-full h-32 bg-[#f5f5f7] dark:bg-[#3a3a3c] border-0 rounded-lg p-3 font-mono text-sm"
              value={receivedData}
              readOnly
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleConnect}
              disabled={isConnected || !selectedPort}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              Conectar
            </button>
            <button
              onClick={disconnect}
              disabled={!isConnected}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              Desconectar
            </button>
            <button
              onClick={handleSend}
              disabled={!isConnected}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              Enviar Teste
            </button>
          </div>
        </div>
      </SafeArea>
    </DefaultLayout>
  );
}