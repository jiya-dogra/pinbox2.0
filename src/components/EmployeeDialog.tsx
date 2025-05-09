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
        setFormData({
            fullName: employee?.fullName || '',
            email: employee?.email || '',
            password: employee?.password || ''
        });
    }, [isOpen, employee]);

    const handleDeleteWithConfirm = () => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            onDelete();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={style.dialogOverlay}>
            <div className={style.dialog}>
                <h2>{employee ? 'Edit Employee' : 'Add Employee'}</h2>
                <form
                    className={style.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(formData);
                    }}>
                    <input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        placeholder='Full Name'
                    />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={!!employee}
                        placeholder='Email'
                    />
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        placeholder='Password'
                    />
                    <div className={style.btngrp}>
                        {employee && (
                            <button
                                style={{ fontSize: '1.2em' }}
                                type="button"
                                onClick={handleDeleteWithConfirm}
                                disabled={isSubmitting}>
                                Delete
                            </button>
                        )}
                        <button style={{ fontSize: '1.2em' }} type="button" onClick={onClose}>Cancel</button>
                        <button style={{ fontSize: '1.2em' }} type="submit" disabled={isSubmitting}>
                            {employee ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}