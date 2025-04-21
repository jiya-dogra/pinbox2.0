'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/src/utils/auth';

export default function AdminHeader() {
    const router = useRouter();

    return (
        <div className='nav-wrapper'>
            <p className='logo'>PINBOX</p>
            <nav className='nav'>
                <ul>
                    <li onClick={() => router.push('/admin-panel')}>Dashboard</li>
                    <li onClick={() => router.push('/admin-panel/manage-rooms')}>Rooms</li>
                    <li onClick={() => router.push('/admin-panel/manage-employees')}>Employees</li>
                </ul>
            </nav>
            <p className='login' onClick={logout}>Logout</p>
        </div>
    );
}
