'use client';
import style from '@/src/styles/employee.module.css';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
    return (
        <div className={style.modalOverlay}>
            <div className={style.modal}>
                {children}
            </div>
        </div>
    );
}