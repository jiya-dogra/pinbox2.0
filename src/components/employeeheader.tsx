'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/src/utils/auth';

export default function EmployeeHeader() {
    const router = useRouter();

    return (
        <header>
            <nav>
                <button onClick={() => router.push('/employee-panel')}>Dashboard</button>
                <button onClick={logout}>Logout</button>
            </nav>
        </header>
    );
}