'use client';

import style from '@/src/styles/admin.module.css';
import AdminHeader from '@/src/components/adminheader';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { getAdminId } from '@/src/utils/auth';
import { BiSolidEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";

interface Room {
    id: string;
    name: string;
    _count: {
        users: number;
    };
}

export default function ManageRooms() {
    const [activeRow, setActiveRow] = useState<number | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [roomName, setRoomName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const adminId = getAdminId();

    useEffect(() => {
        fetchRooms();
    }, [adminId]);

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
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddClick = () => {
        setCurrentRoom(null);
        setRoomName('');
        setIsDialogOpen(true);
    };

    const handleEditClick = (room: Room, index: number) => {
        setActiveRow(index);
        setCurrentRoom(room);
        setRoomName(room.name);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const url = currentRoom
                ? `/api/rooms/${currentRoom.id}`
                : '/api/rooms';
            const method = currentRoom ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: roomName,
                    adminId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Operation failed');
            }

            setIsDialogOpen(false);
            fetchRooms();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (roomId: string) => {
        if (!window.confirm('Are you sure you want to delete this room? Users will be unassigned.')) {
            return;
        }

        try {
            const response = await fetch(`/api/rooms/${roomId}?adminId=${adminId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete room');
            }

            setError('');
            fetchRooms();
        } catch (err: any) {
            setError(err.message || 'Failed to delete room');
        }
    };

    return (
        <ProtectedRoute>
            <div>
                <AdminHeader />
                <div className={style.wrapper}>
                    <div className={style.content}>
                        <ul className={style.roomlist}>
                            <li style={{ color: '#656565' }}>
                                <span style={{ justifySelf: 'center' }}>S.No.</span>
                                <span>Room Name</span>
                                <span style={{ justifySelf: 'center' }}>Members</span>
                                <span
                                    style={{ justifySelf: 'center' }}
                                    onClick={handleAddClick}>
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

                            {rooms
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((room, index) => (
                                    <li
                                        key={room.id}
                                        className={activeRow === index ? style.active : ''}
                                        onClick={() => setActiveRow(index)}
                                    >
                                        <span style={{ justifySelf: 'center' }}>{index + 1}</span>
                                        <span>{room.name}</span>
                                        <span style={{ justifySelf: 'center' }}>{room._count.users}</span>
                                        <span style={{ justifySelf: 'center', display: 'flex', gap: '0.5rem' }}>
                                            <BiSolidEdit
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(room, index);
                                                }}
                                                style={{ cursor: 'pointer', color: 'black' }}
                                                title='Edit'
                                            />
                                            <AiOutlineDelete
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(room.id);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                                title='Delete'
                                            />
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                {/* Room Dialog */}
                {isDialogOpen && (
                    <div className={style.dialogOverlay}>
                        <div className={style.dialog}>
                            <h2>{currentRoom ? 'Edit Room' : 'Add New Room'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={style.formGroup}>
                                    <label>Room Name:</label>
                                    <input
                                        type="text"
                                        value={roomName}
                                        onChange={(e) => setRoomName(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className={style.buttonGroup}>
                                    <button
                                        type="button"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !roomName.trim()}
                                    >
                                        {isSubmitting ? 'Processing...' : currentRoom ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}