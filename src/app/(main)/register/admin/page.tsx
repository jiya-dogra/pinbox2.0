'use client';

import MainHeader from '@/src/components/mainheader';
import style from '@/src/styles/main.module.css'
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateAdminPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const companyId = searchParams.get('companyId');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!companyId) {
            alert('Missing company ID.');
            return;
        }

        const res = await fetch('/api/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, companyId }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage('Admin created successfully!');
            router.push('/login');
        } else {
            alert(data.error || 'Failed to create admin.');
        }
    };

    return (
        <div className='wrapper'>
            <MainHeader />
            <div className='content'>
                <form className={style.formtwo} onSubmit={handleSubmit} autoComplete="off">
                    <h2>Create Admin Account</h2>
                    <input
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" style={{ fontSize: '1.2em' }}>Create Admin</button>
                </form>
                <p style={{ marginTop: '1em' }}><strong>Remember</strong>: You can only create one admin account for a company to access the admin dashboard</p>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
