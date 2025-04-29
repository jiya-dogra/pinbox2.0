'use client'
import { useState, useEffect } from 'react';

interface RoomData {
    name: string;
    count: number;
}

export const useDashboard = () => {
    const [data, setData] = useState({
        totalEmployees: 0,
        totalRooms: 0,
        roomOccupancy: [] as RoomData[],
        employeesPerRoom: [] as RoomData[]
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin-dashboard');
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, isLoading };
};