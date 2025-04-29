'use client'
import { useEffect, useState } from 'react';
import style from '@/src/styles/admin.module.css';

interface RoomDialogProps {
    isOpen: boolean;
    room: { id: string; name: string } | null;
    onSubmit: (name: string) => Promise<void>;
    onClose: () => void;
    isSubmitting: boolean;
}

export default function RoomDialog({
    isOpen,
    room,
    onSubmit,
    onClose,
    isSubmitting
}: RoomDialogProps) {
    const [name, setName] = useState(room?.name || '');

    useEffect(() => {
        if (isOpen) {
            setName(room?.name || '');
        }
    }, [isOpen, room]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(name);
    };

    return (
        <div className={style.dialogOverlay}>
            <div className={style.dialog}>
                <h2>{room ? 'Edit Room' : 'Add New Room'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={style.formGroup}>
                        <label>Room Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className={style.buttonGroup}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                        >
                            {isSubmitting ? 'Processing...' : room ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}