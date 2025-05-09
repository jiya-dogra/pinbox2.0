import MainHeader from '@/src/components/mainheader';
import style from '@/src/styles/main.module.css';

export default function Developers() {
    return (
        <div className='wrapper'>
            <MainHeader />
            <div className='content'>
                <h1>Meet the Pinbox Team</h1>
                <div className={style.teamGrid}>
                    <div className={style.teamMember}>
                        <div className={style.avatar}>JD</div>
                        <h2>Jiya Dogra</h2>
                        <p>Full Stack Developer</p>
                        <p>Developed Frontend and Backend</p>
                    </div>

                    <div className={style.teamMember}>
                        <div className={style.avatar}>GG</div>
                        <h2>Gautam Gupta</h2>
                        <p>Project Manager</p>
                        <p>Documentation and Resource Management</p>
                    </div>

                    <div className={style.teamMember}>
                        <div className={style.avatar}>RM</div>
                        <h2>Raghuraj Mathur</h2>
                        <p>UX Specialist</p>
                        <p>Creative User Experience Design</p>
                    </div>
                </div>

                <div className={style.techStack}>
                    <h2 style={{ textAlign: 'center', color: '#b8cedc' }}>Our Tech Stack</h2>
                    <div className={style.techGrid}>
                        <div className={style.techItem}>
                            <h2>Frontend</h2>
                            <p>Next.js, React, TypeScript,</p>
                            <p>FullCalendar</p>
                        </div>
                        <div className={style.techItem}>
                            <h2>Backend</h2>
                            <p>Node.js, Express,</p>
                            <p>PostgreSQL, Prisma</p>
                        </div>
                    </div>
                </div>

                <div className={style.contribution}>
                    <h2>Want to Contribute?</h2>
                    <p>
                        Pinbox is open to collaborations! If you're interested in contributing to our project,
                        then reach out to us directly.
                    </p>
                    <button style={{ fontSize: '1.2em' }}>Contact Us</button>
                </div>
            </div>
        </div>
    );
}