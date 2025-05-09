import { FiUsers, FiHome } from 'react-icons/fi';
import style from '@/src/styles/admin.module.css';

export default function DashboardMetrics({
    totalEmployees,
    totalRooms,
    isLoading
}: {
    totalEmployees: number;
    totalRooms: number;
    isLoading: boolean;
}) {
    return (
        <div className={style.dashboardMetrics}>
            <div className={style.metricCard}>
                <FiUsers className={style.metricIcon} />
                <h3>Organization Size</h3>
                <h3>{isLoading ? '...' : totalEmployees}</h3>
            </div>
            <div className={style.metricCard}>
                <FiHome className={style.metricIcon} />
                <h3>Organization Departments</h3>
                <h3>{isLoading ? '...' : totalRooms}</h3>
            </div>
        </div>
    );
}