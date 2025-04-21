'use client';

import MainHeader from '@/src/components/mainheader';
import { useState, useEffect } from 'react';
import style from '@/src/styles/register.module.css';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());
        console.log('Form values:', values);

        const isEmpty = ['companyName', 'companyEmail', 'companyPhone', 'industryType', 'companyAddress']
            .some(key => !values[key]?.toString().trim());

        if (isEmpty) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const res = await fetch('/api/company', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.companyName,
                    email: values.companyEmail,
                    phone: values.companyPhone,
                    industryType: values.industryType,
                    address: values.companyAddress,
                    website: values.companyWebsite || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage('Company registered successfully!');
                form.reset();
                setTimeout(() => {
                    router.push(`/register/admin?companyId=${data.companyId}`);
                }, 1500);
            } else {
                alert(data.error || 'Failed to register company.');
            }
        } catch (err) {
            alert('An unexpected error occurred.');
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div>
            <MainHeader />
            <div className={style.wrapper}>
                <div className={style.content}>
                    <p style={{ fontSize: '2.5em', marginTop: '1em' }}>Register Your Company</p>
                    <p style={{ fontSize: '1.2em', marginBlock: '3em' }}>Fill the details of your company</p>

                    <form className={style.form} onSubmit={handleSubmit} autoComplete="off">
                        <label>Company Name:</label>
                        <input name="companyName" type="text" placeholder="e.g. Pinbox Pvt Ltd" />

                        <label>Company Email:</label>
                        <input name="companyEmail" type="email" placeholder="e.g. info@pinbox.com" />

                        <label>Company Phone:</label>
                        <input name="companyPhone" type="tel" placeholder="e.g. +91 9876543210" />

                        <label>Industry Type:</label>
                        <input name="industryType" type="text" placeholder="e.g. SaaS, E-commerce, Healthcare..." />

                        <label>Company Address:</label>
                        <input name="companyAddress" type="text" placeholder="City, State only" />

                        <label>Company Website:</label>
                        <input name="companyWebsite" type="url" placeholder="e.g. https://pinbox.com" />

                        <br />
                        <button type="reset" className={style.button}>Reset Form</button>
                        <button type="submit" className={style.button}>Register Company</button>
                    </form>

                    {successMessage && (
                        <p className={style.toast}>
                            {successMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
