'use client';
import { useState, useEffect } from 'react';
import style from '@/src/styles/admin.module.css';
import { Employee } from '@/src/types/types';

interface RoomMembersDialogProps {
    isOpen: boolean;
    employees: Employee[];
    onClose: (updatedEmployees?: Employee[]) => void;
    onPriorityChange: (employeeId: string, priority: number) => Promise<void>;
}

export default function RoomMembersDialog({
    isOpen,
    employees,
    onClose,
    onPriorityChange,
}: RoomMembersDialogProps) {
    const [localEmployees, setLocalEmployees] = useState<Employee[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLocalEmployees([...employees].sort((a, b) => (a.priority || 0) - (b.priority || 0)));
        }
    }, [employees, isOpen]);

    const handlePriorityChange = async (employeeId: string, newPriority: number) => {
        if (newPriority < 1) return;

        const updatedEmployees = localEmployees.map(e =>
            e.id === employeeId ? { ...e, priority: newPriority } : e
        ).sort((a, b) => (a.priority || 0) - (b.priority || 0));

        setLocalEmployees(updatedEmployees);

        setIsSaving(true);
        try {
            await onPriorityChange(employeeId, newPriority);
        } catch (error) {
            console.error('Failed to update priority:', error);
            setLocalEmployees([...employees].sort((a, b) => (a.priority || 0) - (b.priority || 0)));
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDone = () => {
        onClose(localEmployees);
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={style.dialogOverlay}>
            <div className={style.dialog} style={{ width: '500px' }}>
                <h2>Manage Member Priorities</h2>
                <p>Lower numbers = higher priority (1 = highest)</p>

                <div className={style.memberList}>
                    {localEmployees.map((employee) => (
                        <div key={employee.id} className={style.memberItem}>
                            <span className={style.memberName}>{employee.fullName}</span>
                            <input
                                type="number"
                                min="1"
                                value={employee.priority || ''}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value)) {
                                        handlePriorityChange(employee.id, value);
                                    }
                                }}
                                className={style.priorityInput}
                                disabled={isSaving}
                            />
                        </div>
                    ))}
                </div>

                <div className={style.btngrp}>
                    <button
                        onClick={handleCancel}
                        style={{ fontSize: '1.2em' }}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDone}
                        style={{ fontSize: '1.2em' }}
                        disabled={isSaving}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}