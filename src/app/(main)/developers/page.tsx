import MainHeader from '@/src/components/mainheader';
import style from '@/src/styles/developers.module.css';

export default function Developers() {
    return (
        <div>
            <MainHeader />
            <div className={style.wrapper}>
                <div className={style.content}>
                    <h1>Meet the Pinbox Team</h1>

                    <div className={style.teamGrid}>
                        <div className={style.teamMember}>
                            <div className={style.avatar} style={{ background: '#FFD166' }}>JD</div>
                            <h3>Jiya Dogra</h3>
                            <p>Frontend Architect</p>
                            <p>Specializes in React and UX design</p>
                        </div>

                        <div className={style.teamMember}>
                            <div className={style.avatar} style={{ background: '#06D6A0' }}>GG</div>
                            <h3>Gautam Gupta</h3>
                            <p>Backend Engineer</p>
                            <p>Database and API wizard</p>
                        </div>

                        <div className={style.teamMember}>
                            <div className={style.avatar} style={{ background: '#118AB2' }}>RM</div>
                            <h3>Raghuraj Mathur</h3>
                            <p>Full Stack Developer</p>
                            <p>Integration specialist</p>
                        </div>
                    </div>

                    <div className={style.techStack}>
                        <h2>Our Technology Stack</h2>
                        <div className={style.techGrid}>
                            <div className={style.techItem}>
                                <h3>Frontend</h3>
                                <p>Next.js, React, TypeScript</p>
                                <p>Tailwind CSS, FullCalendar</p>
                            </div>
                            <div className={style.techItem}>
                                <h3>Backend</h3>
                                <p>Node.js, Express</p>
                                <p>PostgreSQL, Prisma</p>
                            </div>
                            <div className={style.techItem}>
                                <h3>DevOps</h3>
                                <p>Docker, AWS</p>
                                <p>CI/CD Pipelines</p>
                            </div>
                        </div>
                    </div>

                    <div className={style.contribution}>
                        <h2>Want to Contribute?</h2>
                        <p>
                            Pinbox is open to collaborations! If you're interested in contributing to our project,
                            check out our GitHub repository or reach out to us directly.
                        </p>
                        <button className={style.contactButton}>Contact Us</button>
                    </div>
                </div>
            </div>
        </div>
    );
}