import { FiArrowRight } from 'react-icons/fi';
import style from '@/src/styles/admin.module.css';

export default function QuickLinks() {
    return (
        <div className={style.quickLinks}>
            <div className={style.linkCard}>
                <a href="/admin-panel/manage-rooms" className={style.Card}>
                    Go To Rooms
                </a>
            </div>
            <div className={style.linkCard}>
                <a href="/admin-panel/manage-employees" className={style.Card}>
                    Go To Employees
                </a>
            </div>
        </div>
    );
}