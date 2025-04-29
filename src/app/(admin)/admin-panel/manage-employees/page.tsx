'use client';

import style from '@/src/styles/admin.module.css';
import AdminHeader from '@/src/components/adminheader';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { getAdminId } from '@/src/utils/auth';
import { FaTrash } from 'react-icons/fa';

interface Employee {
    id: string;
    fullName: string;
    email: string;
    password: string;
    room: {
        id: string;
        name: string;
    } | null;
}

interface Room {
    id: string;
    name: string;
}

export default function ManageEmployees() {
    const [activeRow, setActiveRow] = useState<number | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [selectedEmployeeForRoom, setSelectedEmployeeForRoom] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const adminId = getAdminId();

    useEffect(() => {
        if (adminId) {
            fetchEmployees();
            fetchRooms();
        }
    }, [adminId]);

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users?adminId=${adminId}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch employees');
            }
            const data = await res.json();
            setEmployees(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRooms = async () => {
        try {
            const res = await fetch(`/api/rooms?adminId=${adminId}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch rooms');
            }
            const data = await res.json();
            setRooms(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAddClick = () => {
        setCurrentEmployee(null);
        setFormData({ fullName: '', email: '', password: '' });
        setIsDialogOpen(true);
    };

    const handleEditClick = (employee: Employee) => {
        setCurrentEmployee(employee);
        setFormData({
            fullName: employee.fullName,
            email: employee.email,
            password: employee.password
        });
        setIsDialogOpen(true);
    };

    const handleRoomAssignClick = (employeeId: string) => {
        setSelectedEmployeeForRoom(employeeId);
        setIsRoomDialogOpen(true);
    };

    const assignRoom = async (roomId: string) => {
        if (!selectedEmployeeForRoom) return;

        try {
            const response = await fetch('/api/assign-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedEmployeeForRoom,
                    roomId,
                    adminId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to assign room');
            }

            const result = await response.json();

            // Update the specific employee in the state
            setEmployees(prevEmployees =>
                prevEmployees.map(emp =>
                    emp.id === selectedEmployeeForRoom
                        ? {
                            ...emp,
                            room: {
                                id: roomId,
                                name: rooms.find(r => r.id === roomId)?.name || ''
                            }
                        }
                        : emp
                )
            );

            setIsRoomDialogOpen(false);
            setSelectedEmployeeForRoom(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = currentEmployee
                ? `/api/users/${currentEmployee.id}`
                : '/api/users';
            const method = currentEmployee ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    adminId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Operation failed');
            }

            setIsDialogOpen(false);
            fetchEmployees();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        }
    };

    const handleDelete = async () => {
        if (!currentEmployee) return;

        if (!window.confirm(`Are you sure you want to delete ${currentEmployee.fullName}?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/users/${currentEmployee.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete employee');
            }

            setIsDialogOpen(false);
            fetchEmployees();
        } catch (err: any) {
            setError(err.message || 'Failed to delete employee');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ProtectedRoute>
            <div>
                <AdminHeader />
                <div className={style.wrapper}>
                    <div className={style.content}>
                        <ul className={style.emplist}>
                            <li style={{ color: '#656565' }}>
                                <span style={{ justifySelf: 'center' }}>S.No.</span>
                                <span>Name</span>
                                <span>Email</span>
                                <span>Rooms</span>
                                <span
                                    style={{ justifySelf: 'center', cursor: 'pointer' }}
                                    onClick={handleAddClick}
                                >
                                    Add...
                                </span>
                            </li>
                            {error && (
                                <li className={style.errorRow}>
                                    <span style={{ gridColumn: '1 / -1' }}>{error}</span>
                                </li>
                            )}
                            {isLoading && !error && (
                                <li className={style.loadingRow}>
                                    <span style={{ gridColumn: '1 / -1' }}>Loading employees...</span>
                                </li>
                            )}
                            {employees
                                .sort((a, b) => a.fullName.localeCompare(b.fullName))
                                .map((employee, index) => (
                                    <li
                                        key={employee.id}
                                        className={activeRow === index ? style.active : ''}
                                        onClick={() => setActiveRow(index)}
                                    >
                                        <span style={{ justifySelf: 'center' }}>{index + 1}</span>
                                        <span>{employee.fullName}</span>
                                        <span>{employee.email}</span>
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRoomAssignClick(employee.id);
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                color: employee.room ? 'inherit' : '#999',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            {employee.room ? employee.room.name : 'N/A'}
                                        </span>
                                        <span
                                            style={{ justifySelf: 'center', cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(employee);
                                            }}
                                        >
                                            Edit...
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                {/* Employee Edit/Add Dialog */}
                {isDialogOpen && (
                    <div className={style.dialogOverlay}>
                        <div className={style.dialog}>
                            <h2>{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={style.formGroup}>
                                    <label>Full Name:</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={style.formGroup}>
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!!currentEmployee}
                                    />
                                </div>
                                <div className={style.formGroup}>
                                    <label>Password:</label>
                                    <input
                                        type="text"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={style.buttonGroup}>
                                    {currentEmployee && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                        >{isDeleting ? 'Deleting...' : <>Delete</>}</button>
                                    )}
                                    <button type="button" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit">
                                        {currentEmployee ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Room Assignment Dialog */}
                {isRoomDialogOpen && (
                    <div className={style.dialogOverlay}>
                        <div className={style.dialog}>
                            <h2>Assign Room</h2>
                            <div className={style.roomList}>
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className={style.roomItem}
                                        onClick={() => assignRoom(room.id)}
                                    >
                                        {room.name}
                                    </div>
                                ))}
                            </div>
                            <div className={style.buttonGroup}>
                                <button
                                    type="button"
                                    onClick={() => setIsRoomDialogOpen(false)}
                                    style={{ marginTop: '20px' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}