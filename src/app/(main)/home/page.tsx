'use client'

import MainHeader from '@/src/components/mainheader';
import { useRouter } from 'next/navigation';
import style from '@/src/styles/landingpage.module.css';

export default function LandingPage() {

    const router = useRouter();

    return (
        <div>
            <MainHeader />
            <div className={style.wrapper}>
                <div className={style.content}>
                    <div className={style.hero}>
                        <h1>Streamline Your Team's Productivity with Pinbox</h1>
                        <p className={style.tagline}>The all-in-one collaboration platform designed for modern workplaces</p>
                        <button
                            className={style.ctaButton}
                            onClick={() => router.push('/register')}
                        >Get Started - It's Free</button>
                    </div>
                    <div className={style.features}>
                        <div className={style.featureCard}>
                            <h3>Task Management</h3>
                            <p>Assign, track, and prioritize tasks with ease across your entire team.</p>
                        </div>
                        <div className={style.featureCard}>
                            <h3>Smart Scheduling</h3>
                            <p>Integrated calendar views help everyone stay on the same page.</p>
                        </div>
                        <div className={style.featureCard}>
                            <h3>Role-Based Access</h3>
                            <p>Admin and employee dashboards tailored to different needs.</p>
                        </div>
                    </div>
                    <div className={style.testimonial}>
                        <blockquote>
                            "Pinbox transformed how our team collaborates. We've seen a 40% increase in productivity since switching."
                        </blockquote>
                        <p>- Sarah K., Marketing Team Lead</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
