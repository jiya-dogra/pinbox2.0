import { useState, useEffect } from 'react';

export const useEmployeeDashboard = (userId?: string) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/employee-dashboard?userId=${userId}`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    return { data, isLoading };
};