import { useSerial } from '@/contexts/serial';
import { useState } from 'react';
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
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Controle de Porta Serial</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p><strong>Porta Atual:</strong> {port || 'Nenhuma'}</p>
            <p><strong>Status:</strong> {isConnected ? 'Conectado' : 'Desconectado'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Porta Serial</label>
            <select
              value={selectedPort}
              onChange={(e) => setSelectedPort(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              disabled={isConnected}
            >
              <option value="">Selecione uma porta</option>
              {availablePorts.map((port) => (
                <option key={port} value={port}>
                  {port}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p><strong>Mensagem de Status:</strong> {statusMessage || 'Nenhuma'}</p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Configurações do Dispositivo</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Voltagem Nominal (V)</label>
              <input
                type="number"
                value={localMainsV}
                onChange={(e) => setLocalMainsV(parseFloat(e.target.value))}
                className="mt-1 block w-full border rounded p-2"
                disabled={!isConnected}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Corrente RMS (A) - Somente Leitura</label>
              <input
                type="number"
                value={irms.toFixed(3)}
                className="mt-1 block w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>
          </div>
          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium">Fator de Potência</label>
                <input
                  type="number"
                  step="0.01"
                  value={localPf}
                  onChange={(e) => setLocalPf(parseFloat(e.target.value))}
                  className="mt-1 block w-full border rounded p-2"
                  disabled={!isConnected}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Sensibilidade (V/A)</label>
                <input
                  type="number"
                  step="0.001"
                  value={localSens}
                  onChange={(e) => setLocalSens(parseFloat(e.target.value))}
                  className="mt-1 block w-full border rounded p-2"
                  disabled={!isConnected}
                />
              </div>
            </div>
          )}
          <div className="mt-4 space-x-2">
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
              onClick={handleApplyConfig}
              disabled={!isConnected}
            >
              Aplicar Configurações
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={toggleAdvanced}
            >
              {showAdvanced ? 'Ocultar Opções Avançadas' : 'Mostrar Opções Avançadas'}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Dados em Tempo Real</h2>
          <p><strong>Corrente RMS (A):</strong> {irms.toFixed(3)}</p>
          <p><strong>Potência (W):</strong> {powerW.toFixed(1)}</p>
          <p><strong>Energia Acumulada (kWh):</strong> {energyKWh.toFixed(6)}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Log de Dados Recebidos</h2>
          <textarea
            className="w-full h-32 border rounded p-2 font-mono text-sm"
            value={receivedData}
            readOnly
          />
        </div>

        <div className="mt-4 space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            onClick={handleConnect}
            disabled={isConnected || !selectedPort}
          >
            Conectar
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
            onClick={disconnect}
            disabled={!isConnected}
          >
            Desconectar
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            onClick={handleSend}
            disabled={!isConnected}
          >
            Enviar Teste
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}