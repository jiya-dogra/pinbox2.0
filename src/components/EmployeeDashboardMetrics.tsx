import React from 'react';
import style from '@/src/styles/employee.module.css';
import { MdOutlineTaskAlt, MdOutlinePendingActions } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { RiAlertLine } from "react-icons/ri";

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
                <FaTasks className={style.metricIcon} />
                <h3>Total Tasks</h3>
                <h3>{totalTasks || 0}</h3>
            </div>
            <div className={style.metricCard}>
                <MdOutlineTaskAlt className={style.metricIcon} />
                <h3>Completed</h3>
                <h3>{completedTasks || 0}</h3>
            </div>
            <div className={style.metricCard}>
                <MdOutlinePendingActions className={style.metricIcon} />
                <h3>Pending</h3>
                <h3>{pendingTasks || 0}</h3>
            </div>
            <div className={style.metricCard}>
                <RiAlertLine className={style.metricIcon} />
                <h3>Overdue</h3>
                <h3>{overdueTasks || 0}</h3>
            </div>
        </div>
    );
};