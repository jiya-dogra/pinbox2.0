'use client'
import style from '@/src/styles/main.module.css';
import MainHeader from '@/src/components/mainheader';
import { useRouter } from 'next/navigation';

export default function About() {
    const router = useRouter();
    return (
        <div className='wrapper'>
            <MainHeader />
            <div className='content'>
                <h1 style={{ color: '#b8cedc' }}>About Pinbox</h1>
                <p className={style.lead}>
                    Revolutionizing workplace collaboration through intuitive task management and team coordination.
                </p>
                <section className={style.section} style={{ marginRight: '35%' }}>
                    <h2>Our Story</h2>
                    <p>
                        In January 2025, a group of entrepreneurs in Silicon Valley set out to revolutionize team
                        collaboration as remote work surged. Frustrated by existing tools, they created "PINBOX," a
                        platform designed to streamline communication and task management. After gathering user
                        feedback and refining their vision, they launched the platform, quickly gaining traction and
                        empowering organizations to enhance productivity and collaboration. PINBOX marked the dawn of a
                        new era in team management.
                    </p>
                </section>

                <section className={style.section} style={{ marginLeft: '35%' }}>
                    <h2>Our Mission</h2>
                    <p>
                        At PINBOX, our mission is to empower teams and organizations by providing a seamless and
                        intuitive platform that simplifies collaboration and enhances productivity. We are dedicated
                        to fostering transparent communication and efficient task management, enabling teams to work
                        together effectively, regardless of their location. Our goal is to create an environment where
                        every team member can thrive, contribute, and achieve their full potential. By streamlining
                        processes and promoting a culture of teamwork, we aim to help organizations reach their
                        objectives with confidence and ease, transforming the way they manage projects and collaborate
                        in the modern workplace. Together, we are committed to making teamwork not just simpler, but a
                        truly engaging and rewarding experience.
                    </p>
                </section>

                <section className={style.section} style={{ marginRight: '35%' }}>
                    <h2>Core Features</h2>
                    <ul className={style.featureList}>
                        <li>Intuitive task assignment and tracking</li>
                        <li>Visual project timelines and calendars</li>
                        <li>Role-specific dashboards (Admin/Employee)</li>
                        <li>Real-time collaboration spaces</li>
                        <li>Priority-based task assignment</li>
                    </ul>
                </section>

                <section className={style.section} style={{ marginLeft: '35%' }}>
                    <h2 onClick={() => router.push('/contact')} style={{ cursor: 'pointer' }} title='Contact'>Join Our Journey</h2>
                    <p>
                        We're constantly evolving based on user feedback. Your experience shapes Pinbox's future -
                        we'd love to hear your thoughts and ideas!
                    </p>
                </section>
            </div>
        </div>
    );
}