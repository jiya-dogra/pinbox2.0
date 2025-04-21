'use client';

import style from '@/src/styles/admin.module.css';
import AdminHeader from '@/src/components/adminheader';
import ProtectedRoute from '@/src/components/ProtectedRoute';

export default function AdminPanel() {
    return (
        <ProtectedRoute>
            <div>
                <AdminHeader />
                <div className={style.wrapper}>
                    <div className={style.content}>
                        <p>Admin Panel</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}