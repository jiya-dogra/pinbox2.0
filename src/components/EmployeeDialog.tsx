'use client'
import { useState, useEffect } from 'react';
import style from '@/src/styles/admin.module.css';
import { Employee } from '@/src/types/types';

interface EmployeeDialogProps {
    isOpen: boolean;
    employee: Employee | null;
    onSubmit: (data: { fullName: string; email: string; password: string }) => void;
    onDelete: () => void;
    onClose: () => void;
    isSubmitting: boolean;
}

export default function EmployeeDialog({
    isOpen,
    employee,
    onSubmit,
    onDelete,
    onClose,
    isSubmitting
}: EmployeeDialogProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                fullName: employee.fullName,
                email: employee.email,
                password: employee.password
            });
        } else {
            setFormData({ fullName: '', email: '', password: '' });
        }
    }, [employee]);

    if (!isOpen) return null;

    return (
        <div className={style.dialogOverlay}>
            <div className={style.dialog}>
                <h2>{employee ? 'Edit Employee' : 'Add Employee'}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(formData);
                }}>
                    <div className={style.formGroup}>
                        <label>Full Name</label>
                        <input
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            disabled={!!employee}
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className={style.buttonGroup}>
                        {employee && (
                            <button type="button" onClick={onDelete} disabled={isSubmitting}>
                                Delete
                            </button>
                        )}
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={isSubmitting}>
                            {employee ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}