'use client';
import { useEmployees } from '@/src/hooks/useEmployees';
import AdminHeader from '@/src/components/adminheader';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import EmployeeList from '@/src/components/EmployeeList';
import EmployeeDialog from '@/src/components/EmployeeDialog';
import RoomAssignmentDialog from '@/src/components/RoomAssignmentDialog';
import style from '@/src/styles/admin.module.css';

export default function ManageEmployees() {
    const {
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
        closeDialogs
    } = useEmployees();

    return (
        <ProtectedRoute>
            <div className={style.wrapper}>
                <AdminHeader />
                <div className={style.content}>
                    <EmployeeList
                        employees={employees}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onAssignRoom={handleAssignRoom}
                        error={error}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <EmployeeDialog
                isOpen={isDialogOpen}
                employee={currentEmployee}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                onClose={closeDialogs}
                isSubmitting={isSubmitting}
            />

            <RoomAssignmentDialog
                isOpen={isRoomDialogOpen}
                rooms={rooms}
                onAssign={assignRoom}
                onClose={closeDialogs}
            />
        </ProtectedRoute>
    );
}