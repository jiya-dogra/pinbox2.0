'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import style from '@/src/styles/register.module.css';
import MainHeader from '@/src/components/mainheader';
import { login, isAuthenticated } from '@/src/utils/auth';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'employee' // Default to employee
    });
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) {
            const userType = localStorage.getItem('userType');
            router.push(userType === 'admin' ? '/admin-panel' : '/employee-panel');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                login(data.userType, data.userId);
                router.push(data.userType === 'admin' ? '/admin-panel' : '/employee-panel');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div>
            <MainHeader />
            <div className={style.wrapper}>
                <div className={style.content}>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit} className={style.formtwo}>
                        <div className={style.optionwrapper}>
                            <div className={style.option}>
                                <label>Employee</label>
                                <input
                                    type="radio"
                                    name="userType"
                                    value="employee"
                                    checked={formData.userType === 'employee'}
                                    onChange={() => setFormData(p => ({ ...p, userType: 'employee' }))}
                                />
                            </div>
                            <div className={style.option}>
                                <label>Admin</label>
                                <input
                                    type="radio"
                                    name="userType"
                                    value="admin"
                                    checked={formData.userType === 'admin'}
                                    onChange={() => setFormData(p => ({ ...p, userType: 'admin' }))}
                                />
                            </div>
                        </div>

                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button type="submit" className={style.button}>Login</button>
                    </form>
                    {error && <p className={style.error}>{error}</p>}
                </div>
            </div>
        </div>
    );
}