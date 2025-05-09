'use client';

import EmployeeHeader from '@/src/components/employeeheader';
import style from '@/src/styles/employee.module.css';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { useEmployeeDashboard } from '@/src/hooks/useEmployeeDashboard';
import { TaskStatusChart } from '@/src/components/TaskStatusChart';
import { TaskDueDateChart } from '@/src/components/TaskDueDateChart';
import { DashboardMetrics } from '@/src/components/EmployeeDashboardMetrics';
import { getStoredUser } from '@/src/utils/auth';

export default function EmployeePanel() {
    const user = getStoredUser();
    const { data, isLoading } = useEmployeeDashboard(user?.userId ?? undefined);

    return (
        <ProtectedRoute>
            <div className={style.wrapper}>
                <EmployeeHeader />
                <div className={style.content}>
                    <DashboardMetrics
                        totalTasks={data?.totalTasks}
                        completedTasks={data?.completedTasks}
                        pendingTasks={data?.pendingTasks}
                        overdueTasks={data?.overdueTasks}
                        isLoading={isLoading}
                    />

                    <div className={style.dashboardCharts}>
                        <TaskStatusChart
                            data={data?.taskStatusDistribution}
                            isLoading={isLoading}
                        />
                        <TaskDueDateChart
                            data={data?.tasksByDueDate}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}