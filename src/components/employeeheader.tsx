'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/src/utils/auth';

export default function EmployeeHeader() {
    const router = useRouter();

    return (
        <div className='nav-wrapper'>
            <p className='logo' onClick={() => router.push('/employee-panel')}>PINBOX</p>
            <nav className='nav'>
                <ul>
                    <li onClick={() => router.push('/employee-panel')}>Dashboard</li>
                    <li onClick={() => router.push('/employee-panel/tasks')}>Tasks</li>
                    <li onClick={() => router.push('/employee-panel/calendar')}>Calendar</li>
                </ul>
            </nav>
            <p className='login' onClick={logout}>Logout</p>
        </div>
    );
}