'use client';
import { useState, useEffect } from 'react';
import { getStoredUser } from '@/src/utils/auth';
import TaskList from '@/src/components/TaskList';
import TaskForm from '@/src/components/TaskForm';
import EmployeeHeader from '@/src/components/employeeheader';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import style from '@/src/styles/employee.module.css';

interface UserDetails {
    id: string;
    priority?: number;
    roomId?: string;
    room?: {
        id: string;
        name: string;
    };
}

export default function Tasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const user = getStoredUser();

    useEffect(() => {
        if (user?.userId) {
            // Fetch current user details including priority and roomId
            Promise.all([
                fetch(`/api/users/me?userId=${user.userId}`).then(res => res.json()),
                fetch(`/api/tasks?userId=${user.userId}`).then(res => res.json())
            ])
                .then(([userData, taskData]) => {
                    setCurrentUser(userData);
                    setTasks(taskData);

                    // Only fetch employees if roomId exists
                    if (userData.roomId) {
                        fetch(`/api/users/by-room?roomId=${userData.roomId}`)
                            .then(res => res.json())
                            .then(data => setEmployees(data));
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user?.userId]);

    const handleCreateTask = async (taskData: {
        title: string;
        description: string;
        dueDate: string;
        assignedToId: string;
    }) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...taskData,
                    assignedById: user?.userId
                })
            });

            if (response.ok) {
                const newTask = await response.json();
                setTasks(prev => [...prev, newTask]);
            }
        } catch (error) {
            console.error('Task creation failed:', error);
        }
    };

    if (loading || !currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <ProtectedRoute>
            <div>
                <EmployeeHeader />
                <div className={style.wrapper}>
                    <div className={style.content}>
                        <h1>Task Management</h1>
                        <div className={style.taskHeader}>
                            <h2>Your Tasks</h2>
                            <button
                                onClick={() => setIsDialogOpen(true)}
                                className={style.addButton}
                            >
                                Add Task...
                            </button>
                        </div>

                        <TaskList
                            tasks={tasks}
                            onTaskClick={(task) => {
                                // Handle task click (view/edit)
                                console.log('Task clicked:', task);
                            }}
                        />

                        <TaskForm
                            employees={employees}
                            onSubmit={handleCreateTask}
                            currentUserPriority={currentUser.priority || 1}
                            isOpen={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                        />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}