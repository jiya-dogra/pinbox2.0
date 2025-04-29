'use client';
import { useDashboard } from '@/src/hooks/useDashboard';
import AdminHeader from '@/src/components/adminheader';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import DashboardMetrics from '@/src/components/DashboardMetrics';
import RoomDistribution from '@/src/components/RoomDistribution';
import EmployeeBars from '@/src/components/EmployeeBars';
import QuickLinks from '@/src/components/QuickLinks';
import style from '@/src/styles/admin.module.css';

export default function AdminPanel() {
    const { data, isLoading } = useDashboard();

    return (
        <ProtectedRoute>
            <div>
                <AdminHeader />
                <div className={style.wrapper}>
                    <div className={style.admincontent}>
                        <DashboardMetrics
                            totalEmployees={data?.totalEmployees}
                            totalRooms={data?.totalRooms}
                            isLoading={isLoading}
                        />

                        <div className={style.dashboardCharts}>
                            <RoomDistribution data={data?.employeesPerRoom} />
                            <EmployeeBars data={data?.roomOccupancy} />
                        </div>

                        <QuickLinks />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}