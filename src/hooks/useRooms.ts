'use client';
import { useState, useEffect } from 'react';
import { getAdminId } from '@/src/utils/auth';
import { Room } from '@/src/types/types';

export const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Add refresh trigger state
    const adminId = getAdminId();

    const fetchRooms = async () => {
        setIsLoading(true);
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

    // Add this function to trigger refreshes
    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleAdd = () => {
        setCurrentRoom(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (room: Room, index: number) => {
        setCurrentRoom(room);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await fetch(`/api/rooms/${id}?adminId=${adminId}`, {
                    method: 'DELETE',
                });
                triggerRefresh(); // Use triggerRefresh instead of fetchRooms
            } catch (err: any) {
                setError(err.message || 'Failed to delete room');
            }
        }
    };

    const handleSubmit = async (name: string) => {
        setIsSubmitting(true);
        try {
            const url = currentRoom
                ? `/api/rooms/${currentRoom.id}`
                : '/api/rooms';
            const method = currentRoom ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, adminId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Operation failed');
            }

            setIsDialogOpen(false);
            triggerRefresh(); // Use triggerRefresh instead of fetchRooms
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setCurrentRoom(null);
    };

    useEffect(() => {
        if (adminId) {
            fetchRooms();
        }
    }, [adminId, refreshKey]); // Add refreshKey to dependencies

    return {
        rooms,
        currentRoom,
        isDialogOpen,
        error,
        isLoading,
        isSubmitting,
        handleAdd,
        handleEdit,
        handleDelete,
        handleSubmit,
        closeDialog,
        fetchRooms: triggerRefresh, // Expose triggerRefresh as fetchRooms
        refreshKey // Optional: expose if needed elsewhere
    };
};