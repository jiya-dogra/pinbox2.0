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
                <form onSubmit={handleSubmit} className={style.form}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        placeholder='Room Name'
                    />
                    <div className={style.btngrp}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            style={{ fontSize: '1.2em' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            style={{ fontSize: '1.2em' }}
                        >
                            {isSubmitting ? 'Processing...' : room ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}