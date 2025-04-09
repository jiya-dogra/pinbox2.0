
import style from '../../../styles/about.module.css'

export default function About() {
    return (
        <div className={style.wrapper}>
            <div className={style.content}>
                <p className={style.heading}>About Us</p>
                <p className={style.description}>Welcome to PINBOX! We are a dedicated team of three passionate individuals —
                    Jiya Dogra, Gautam Gupta, and Raghuraj Mathur — who have come together to create a
                    platform that revolutionizes collaboration and task management in today’s fast-paced work environment.</p>
                <p className={style.heading}>Our Vision</p>
                <p className={style.description}>In our collective experience, we recognized the challenges that teams face
                    in coordinating efforts and managing tasks effectively. This inspired us to develop PINBOX, a robust platform
                    designed to streamline these processes and cater to the diverse needs of teams and organizations. Our goal is
                    to empower users at every level, from administrators overseeing user management to employees focused on task
                    execution.</p>
                <p className={style.heading}>What We Offer</p>
                <p className={style.description}>At the core of PINBOX is a comprehensive user management system that distinguishes
                    between admin and employee roles. Administrators can create, update, and delete users, manage collaborative
                    spaces, and ensure that teams are aligned with their objectives. For employees, PINBOX provides a dynamic
                    environment where tasks can be assigned based on priority levels, promoting balanced workloads and timely
                    completion of assignments.<br />
                    Our platform features a task list for employees to view their assignments and a calendar for tracking important
                    dates and deadlines. This functionality supports effective time management and helps teams maintain focus on
                    their responsibilities.</p>
                <p className={style.heading}>Our Commitment</p>
                <p className={style.description}>We are committed to continuously improving PINBOX based on user feedback and the
                    evolving needs of the workplace. Our mission is to empower teams, enhance communication, and drive productivity,
                    making PINBOX an ideal solution for organizations seeking to optimize their workflow.<br />
                    Thank you for taking the time to learn about us and PINBOX. We invite you to explore the platform and discover
                    how it can transform your team’s collaboration and task management experience. Together, let’s unlock the full
                    potential of your organization!<br />
                    Feel free to reach out to us with any questions, suggestions, or experiences you’d like to share. We’re excited
                    to connect with fellow professionals and learn from your insights!</p>
            </div>
        </div>
    );
}