import { FiArrowRight } from 'react-icons/fi';
import style from '@/src/styles/admin.module.css';

export default function QuickLinks() {
    return (
        <div className={style.quickLinks}>
            <a href="/admin-panel/manage-rooms" className={style.Card}>
                Manage Rooms <FiArrowRight />
            </a>
            <a href="/admin-panel/manage-employees" className={style.Card}>
                Manage Employees <FiArrowRight />
            </a>
        </div>
    );
}