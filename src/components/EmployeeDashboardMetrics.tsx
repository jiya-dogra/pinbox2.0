import React from 'react';
import style from '@/src/styles/employee.module.css';

interface DashboardMetricsProps {
    totalTasks?: number;
    completedTasks?: number;
    pendingTasks?: number;
    overdueTasks?: number;
    isLoading: boolean;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    isLoading
}) => {
    if (isLoading) {
        return <div className={style.metricsContainer}>Loading metrics...</div>;
    }

    return (
        <div className={style.metricsContainer}>
            <div className={style.metricCard}>
                <h3>Total Tasks</h3>
                <p>{totalTasks || 0}</p>
            </div>
            <div className={style.metricCard}>
                <h3>Completed</h3>
                <p>{completedTasks || 0}</p>
            </div>
            <div className={style.metricCard}>
                <h3>Pending</h3>
                <p>{pendingTasks || 0}</p>
            </div>
            <div className={style.metricCard}>
                <h3>Overdue</h3>
                <p>{overdueTasks || 0}</p>
            </div>
        </div>
    );
};