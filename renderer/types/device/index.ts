export interface Device {
    id: string;
    name: string;
    status: 'online' | 'offline';
    power: number;
    voltage: number;
    current: number;
}