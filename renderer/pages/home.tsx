import { useSerial } from '@/contexts/serial';
import DefaultLayout from '../layouts/default';

export default function HomePage() {
  const { connect, disconnect, sendData, port, availablePorts, isConnected, receivedData } = useSerial();

  const handleConnect = async () => {
    if (availablePorts.length > 0) {
      await connect(availablePorts[0]);
    }
  };

  const handleSend = async () => {
    await sendData('Hello, Serial!');
  };

  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Controle de Porta Serial</h1>
        <p><strong>Porta Atual:</strong> {port || 'Nenhuma'}</p>
        <p><strong>Status:</strong> {isConnected ? 'Conectado' : 'Desconectado'}</p>
        <p><strong>Portas Disponíveis:</strong> {availablePorts.join(', ') || 'Nenhuma'}</p>
        <p><strong>Dados Recebidos:</strong> {receivedData || 'Nenhum dado recebido'}</p>
        <div className="mt-4 space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            onClick={handleConnect}
            disabled={isConnected || availablePorts.length === 0}
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
            Enviar Dados
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}