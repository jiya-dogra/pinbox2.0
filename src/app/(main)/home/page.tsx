'use client'

import MainHeader from '@/src/components/mainheader';
import { useRouter } from 'next/navigation';
import style from '@/src/styles/main.module.css';

export default function LandingPage() {

    const router = useRouter();

    return (
        <div className='wrapper'>
            <MainHeader />
            <div className='content'>
                <div className={style.hero}>
                    <h1>Welcome to<br />Pinbox - Teamwork Simplified</h1>
                    <p>Streamline Your Team's Productivity with Pinbox.<br />The all-in-one collaboration platform designed for modern workplaces</p>
                    <button onClick={() => router.push('/register')}>Get Started</button>
                </div>
                <div className={style.features}>
                    <h1>Features So Simple Yet Effective</h1>
                    <div className={style.featuresdisplay}>
                        <div className={style.featureCard}>
                            <h2>Task Management</h2>
                            <p>Assign, track, and prioritize tasks with ease across your entire team.</p>
                        </div>
                        <div className={style.featureCard}>
                            <h2>Smart Scheduling</h2>
                            <p>Integrated calendar views help everyone stay on the same page.</p>
                        </div>
                        <div className={style.featureCard}>
                            <h2>Role-Based Access</h2>
                            <p>Admin and employee dashboards tailored to different needs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
