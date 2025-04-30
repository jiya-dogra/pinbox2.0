'use client';
import { useState } from 'react';
import style from '@/src/styles/employee.module.css';

interface TaskFormProps {
    employees: { id: string; fullName: string; priority?: number }[];
    onSubmit: (task: { title: string; description: string; dueDate: string; assignedToId: string }) => void;
    currentUserPriority: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function TaskForm({
    employees,
    onSubmit,
    currentUserPriority,
    isOpen,
    onClose
}: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedToId, setAssignedToId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, dueDate, assignedToId });
        // Reset form
        setTitle('');
        setDescription('');
        setDueDate('');
        setAssignedToId('');
        onClose();
    };

    if (!isOpen) return null;

    // Filter employees who have lower priority
    const eligibleEmployees = employees.filter(e => (e.priority || 1) > currentUserPriority);

    return (
        <div className={style.dialogOverlay}>
            <div className={style.dialog}>
                <h2>Assign New Task</h2>

                <form onSubmit={handleSubmit} className={style.taskFormGrid}>
                    <div className={style.formGroup}>
                        <label htmlFor="title">Task Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="dueDate">Due Date</label>
                        <input
                            id="dueDate"
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className={style.formGroupFull}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className={style.formGroupFull}>
                        <label htmlFor="assignedTo">Assign To</label>
                        <select
                            id="assignedTo"
                            value={assignedToId}
                            onChange={(e) => setAssignedToId(e.target.value)}
                            required
                        >
                            <option value="">Select employee</option>
                            {eligibleEmployees.length > 0 ? (
                                eligibleEmployees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.fullName} (Priority: {employee.priority || 1})
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    No eligible employees found
                                </option>
                            )}
                        </select>
                    </div>

                    <div className={style.dialogButtons}>
                        <button type="button" onClick={onClose} className={style.cancelButton}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={style.submitButton}
                            disabled={eligibleEmployees.length === 0}
                        >
                            Assign Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}