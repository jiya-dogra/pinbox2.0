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
            <div className={style.Card}>
                <FiUsers className={style.metricIcon} />
                <h3>Organization Size</h3>
                <p>{isLoading ? '...' : totalEmployees}</p>
            </div>
            <div className={style.Card}>
                <FiHome className={style.metricIcon} />
                <h3>Organization Departments</h3>
                <p>{isLoading ? '...' : totalRooms}</p>
            </div>
        </div>
    );
}