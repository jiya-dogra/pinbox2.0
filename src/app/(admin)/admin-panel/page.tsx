'use client';
import { useEffect, useState } from 'react';
import style from '@/src/styles/admin.module.css';
import AdminHeader from '@/src/components/adminheader';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { FiUsers, FiHome, FiArrowRight } from 'react-icons/fi';

interface RoomData {
    name: string;
    occupancy: number;
    employees?: number;
    count: number;
}

export default function AdminPanel() {
    const [dashboardData, setDashboardData] = useState({
        totalEmployees: 0,
        totalRooms: 0,
        roomOccupancy: [] as RoomData[],
        employeesPerRoom: [] as RoomData[]
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const maxEmployees = Math.max(
        ...dashboardData.roomOccupancy.map(r => r.count),
        ...dashboardData.employeesPerRoom.map(r => r.count)
    );

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin-dashboard');
            const data = await res.json();
            setDashboardData(data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div>
                <AdminHeader />
                <div className={style.wrapper}>
                    <div className={style.admincontent}>
                        {/* Big Metrics */}
                        <div className={style.dashboardMetrics}>
                            <div className={style.Card}>
                                <FiUsers className={style.metricIcon} />
                                <h3>Organization Size</h3>
                                <p>{isLoading ? '...' : dashboardData.totalEmployees}</p>
                            </div>
                            <div className={style.Card}>
                                <FiHome className={style.metricIcon} />
                                <h3>Organization Departments</h3>
                                <p>{isLoading ? '...' : dashboardData.totalRooms}</p>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className={style.dashboardCharts}>
                            <div className={style.Card}>
                                <h3>Employees Distribution</h3>
                                <div className={style.distributionGrid}>
                                    {dashboardData.employeesPerRoom
                                        .sort((a, b) => b.count - a.count)
                                        .slice(0, 8) // Show top 8 rooms
                                        .map((room) => (
                                            <div key={room.name} className={style.gridItem}>
                                                <div className={style.roomName}>{room.name}</div>
                                                <div className={style.employeeDots}>
                                                    {Array.from({ length: Math.min(room.count, 10) }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={style.dot}
                                                        />
                                                    ))}
                                                    {room.count > 10 && (
                                                        <div className={style.moreIndicator}>+{room.count - 10}</div>
                                                    )}
                                                </div>
                                                <div className={style.countLabel}>{room.count} people</div>
                                            </div>
                                        ))}
                                    {dashboardData.employeesPerRoom.length > 8 && (
                                        <div className={style.moreRooms}>
                                            +{dashboardData.employeesPerRoom.length - 8} more rooms
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={style.Card}>
                                <h3>Employees Per Room</h3>
                                <div className={style.horizontalBars}>
                                    {dashboardData.roomOccupancy
                                        .sort((a, b) => b.count - a.count) // Sort by most employees first
                                        .map((room) => (
                                            <div key={room.name} className={style.barItem}>
                                                <span className={style.barLabel}>{room.name}</span>
                                                <div className={style.barTrack}>
                                                    <div
                                                        className={style.barFill}
                                                        style={{
                                                            width: `${Math.min(100, (room.count / maxEmployees) * 100)}%`
                                                        }}
                                                    >
                                                        <span className={style.barCount}>{room.count}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className={style.quickLinks}>
                            <a href="/admin-panel/manage-rooms" className={style.Card}>
                                Manage Rooms <FiArrowRight />
                            </a>
                            <a href="/admin-panel/manage-employees" className={style.Card}>
                                Manage Employees <FiArrowRight />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}