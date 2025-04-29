'use client';

import EmployeeHeader from '@/src/components/employeeheader';
import style from '@/src/styles/admin.module.css';
import ProtectedRoute from '@/src/components/ProtectedRoute';

export default function EmployeePanel() {

    return (
        <ProtectedRoute>
            <div>
                <EmployeeHeader />
                <div className={style.wrapper}>
                    <div className={style.content}>
                        <p>Employee Panel</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}