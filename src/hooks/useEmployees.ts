'use client'
import { useState, useEffect } from 'react';
import { getAdminId } from '@/src/utils/auth';
import { Employee, Room } from '@/src/types/types';

export const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const adminId = getAdminId();

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users?adminId=${adminId}`);
            if (!res.ok) throw new Error('Failed to fetch employees');
            setEmployees(await res.json());
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRooms = async () => {
        try {
            const res = await fetch(`/api/rooms?adminId=${adminId}`);
            if (!res.ok) throw new Error('Failed to fetch rooms');
            setRooms(await res.json());
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAdd = () => {
        setCurrentEmployee(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setCurrentEmployee(employee);
        setIsDialogOpen(true);
    };

    const handleAssignRoom = (employeeId: string) => {
        setSelectedEmployeeId(employeeId);
        setIsRoomDialogOpen(true);
    };

    const assignRoom = async (roomId: string) => {
        if (!selectedEmployeeId) return;

        try {
            const res = await fetch('/api/assign-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedEmployeeId,
                    roomId,
                    adminId
                })
            });

            if (!res.ok) throw new Error('Failed to assign room');

            fetchEmployees();
            setIsRoomDialogOpen(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSubmit = async (formData: {
        fullName: string;
        email: string;
        password: string;
    }) => {
        setIsSubmitting(true);
        try {
            const url = currentEmployee
                ? `/api/users/${currentEmployee.id}`
                : '/api/users';
            const method = currentEmployee ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, adminId })
            });

            if (!res.ok) throw new Error('Operation failed');

            fetchEmployees();
            setIsDialogOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!currentEmployee) return;

        try {
            const res = await fetch(`/api/users/${currentEmployee.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete employee');

            fetchEmployees();
            setIsDialogOpen(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const closeDialogs = () => {
        setIsDialogOpen(false);
        setIsRoomDialogOpen(false);
        setCurrentEmployee(null);
        setSelectedEmployeeId(null);
    };

    useEffect(() => {
        if (adminId) {
            fetchEmployees();
            fetchRooms();
        }
    }, [adminId]);

    // Add this to the return object of useEmployees
    return {
        employees,
        rooms,
        currentEmployee,
        isDialogOpen,
        isRoomDialogOpen,
        error,
        isLoading,
        isSubmitting,
        handleAdd,
        handleEdit,
        handleAssignRoom,
        assignRoom,
        handleSubmit,
        handleDelete,
        closeDialogs,
        updateEmployeePriority: async (employeeId: string, priority: number) => {
            try {
                const res = await fetch(`/api/users/${employeeId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ priority })
                });
                if (!res.ok) throw new Error('Failed to update priority');
                fetchEmployees(); // Refresh the employee list
            } catch (err) {
                console.error('Priority update error:', err);
                throw err;
            }
        }
    };
};