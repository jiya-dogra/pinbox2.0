'use client';
import { useRooms } from '@/src/hooks/useRooms';
import { useEmployees } from '@/src/hooks/useEmployees';
import { useState, useEffect } from 'react';
import AdminHeader from '@/src/components/adminheader';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import RoomList from '@/src/components/RoomList';
import RoomDialog from '@/src/components/RoomDialog';
import style from '@/src/styles/admin.module.css';
import { Room, Employee } from '@/src/types/types';
import RoomMembersDialog from '@/src/components/RoomMembersDialog';

export default function ManageRooms() {
    const {
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
        fetchRooms // Make sure this is exposed in useRooms
    } = useRooms();
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
    const { employees: allEmployees } = useEmployees(); // Renamed to avoid clash
    const [roomEmployees, setRoomEmployees] = useState<Employee[]>([]); // Renamed local state
    const { updateEmployeePriority } = useEmployees();

    useEffect(() => {
        if (selectedRoom) {
            const filtered = allEmployees.filter(e => e.room?.id === selectedRoom.id);
            setRoomEmployees(filtered);
        }
    }, [selectedRoom, allEmployees]);

    const handlePriorityChange = async (employeeId: string, priority: number) => {
        try {
            await updateEmployeePriority(employeeId, priority);
        } catch (error) {
            console.error('Priority update error:', error);
            throw error;
        }
    };


    return (
        <ProtectedRoute>
            <div className={style.wrapper}>
                <AdminHeader />
                <div className={style.content}>
                    <RoomList
                        rooms={rooms}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        error={error}
                        isLoading={isLoading}
                        onMembersClick={(room: Room) => { // Explicitly typed parameter
                            setSelectedRoom(room);
                            setIsMembersDialogOpen(true);
                        }}
                    />
                </div>
            </div>

            <RoomDialog
                isOpen={isDialogOpen}
                room={currentRoom}
                onSubmit={handleSubmit}
                onClose={closeDialog}
                isSubmitting={isSubmitting}
            />

            {selectedRoom && (
                <RoomMembersDialog
                    isOpen={isMembersDialogOpen}
                    employees={roomEmployees}
                    onClose={(updatedEmployees) => {
                        setIsMembersDialogOpen(false);
                        if (updatedEmployees) {
                            setRoomEmployees(updatedEmployees);
                        }
                    }}
                    onPriorityChange={handlePriorityChange}
                />
            )}
        </ProtectedRoute>
    );
}