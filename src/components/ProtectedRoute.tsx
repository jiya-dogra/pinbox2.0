'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from '@/src/utils/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    return <>{children}</>;
}