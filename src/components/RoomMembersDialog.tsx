'use client';
import { useState, useEffect } from 'react';
import style from '@/src/styles/admin.module.css';
import { Employee } from '@/src/types/types';

interface RoomMembersDialogProps {
    isOpen: boolean;
    employees: Employee[];
    onClose: (updatedEmployees?: Employee[]) => void; // Modified to return updates
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

    // Initialize employees when dialog opens
    useEffect(() => {
        if (isOpen) {
            setLocalEmployees([...employees].sort((a, b) => (a.priority || 0) - (b.priority || 0)));
        }
    }, [employees, isOpen]);

    const handlePriorityChange = async (employeeId: string, newPriority: number) => {
        if (newPriority < 1) return;

        // Optimistic UI update
        const updatedEmployees = localEmployees.map(e =>
            e.id === employeeId ? { ...e, priority: newPriority } : e
        ).sort((a, b) => (a.priority || 0) - (b.priority || 0));

        setLocalEmployees(updatedEmployees);

        setIsSaving(true);
        try {
            await onPriorityChange(employeeId, newPriority);
        } catch (error) {
            console.error('Failed to update priority:', error);
            // Revert on error
            setLocalEmployees([...employees].sort((a, b) => (a.priority || 0) - (b.priority || 0)));
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDone = () => {
        onClose(localEmployees); // Pass back the updated employees
    };

    const handleCancel = () => {
        onClose(); // Close without changes
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

                <div className={style.dialogButtons}>
                    <button
                        onClick={handleCancel}
                        className={`${style.button} ${style.cancelButton}`}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDone}
                        className={style.button}
                        disabled={isSaving}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}