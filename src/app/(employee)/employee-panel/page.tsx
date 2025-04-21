'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeHeader from '@/src/components/employeeheader';

export default function EmployeePanel() {
    const router = useRouter();

    useEffect(() => {
        // Verify employee is logged in
        const userType = localStorage.getItem('userType');
        if (userType !== 'employee') {
            router.push('/login');
        }
    }, [router]);

    return (
        <div>
            <EmployeeHeader />
            <div className="employee-dashboard">
                <h1>Employee Dashboard</h1>
                {/* Add employee-specific content here */}
            </div>
        </div>
    );
}