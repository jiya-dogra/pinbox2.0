'use client';
import { useState, useEffect } from 'react';
import { getStoredUser } from '@/src/utils/auth';
import TaskList from '@/src/components/TaskList';
import TaskForm from '@/src/components/TaskForm';
import EmployeeHeader from '@/src/components/employeeheader';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import style from '@/src/styles/employee.module.css';
import { Task } from '@/src/types/types';

type TaskStatus = 'pending' | 'completed';

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
    const [assignedToMe, setAssignedToMe] = useState<Task[]>([]);
    const [assignedByMe, setAssignedByMe] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const user = getStoredUser();

    useEffect(() => {
        if (user?.userId) {
            Promise.all([
                fetch(`/api/users/me?userId=${user.userId}`).then(res => res.json()),
                fetch(`/api/tasks?userId=${user.userId}`).then(res => res.json())
            ])
                .then(([userData, taskData]) => {
                    setCurrentUser(userData);
                    setTasks(taskData);

                    // Separate tasks
                    const toMe = taskData.filter((task: Task) => task.assignedToId === user.userId);
                    const byMe = taskData.filter((task: Task) => task.assignedById === user.userId);
                    setAssignedToMe(toMe);
                    setAssignedByMe(byMe);

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
                if (newTask.assignedToId === user?.userId) {
                    setAssignedToMe(prev => [...prev, newTask]);
                }
                if (newTask.assignedById === user?.userId) {
                    setAssignedByMe(prev => [...prev, newTask]);
                }
            }
        } catch (error) {
            console.error('Task creation failed:', error);
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId ? { ...task, status: newStatus } : task
                    )
                );
                setAssignedToMe(prev =>
                    prev.map(task =>
                        task.id === taskId ? { ...task, status: newStatus } : task
                    )
                );
                setAssignedByMe(prev =>
                    prev.map(task =>
                        task.id === taskId ? { ...task, status: newStatus } : task
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
                setAssignedToMe(prev => prev.filter(task => task.id !== taskId));
                setAssignedByMe(prev => prev.filter(task => task.id !== taskId));
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsDialogOpen(true);
    };

    const handleUpdateTask = async (taskData: {
        title: string;
        description: string;
        dueDate: string;
        assignedToId: string;
    }) => {
        try {
            if (!editingTask) return;

            const response = await fetch(`/api/tasks/${editingTask.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                setAssignedToMe(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                setAssignedByMe(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                setIsDialogOpen(false);
                setEditingTask(null);
            }
        } catch (error) {
            console.error('Task update failed:', error);
        }
    };

    if (loading || !currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <ProtectedRoute>
            <div className={style.wrapper}>
                <EmployeeHeader />
                <div className={style.content}>
                    <div className={style.listwrapper}>
                        <div className={style.listcontent}>
                            <h2>Tasks Assigned To Me</h2>
                            <TaskList
                                tasks={assignedToMe}
                                onTaskClick={(task) => console.log('Task clicked:', task)}
                                onStatusChange={handleStatusChange}
                                onDeleteTask={handleDeleteTask}
                                onEditTask={(task) => {
                                    setEditingTask(task);
                                    setIsDialogOpen(true);
                                }}
                                showAssignedBy={true}
                                allowEditDelete={false}
                            />
                        </div>
                        <div className={style.listcontent}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2>Tasks Assigned By Me</h2>
                                <button
                                    onClick={() => setIsDialogOpen(true)}
                                    style={{ fontSize: '1.2em' }}
                                >
                                    Add Task...
                                </button>
                            </div>
                            <TaskList
                                tasks={assignedByMe}
                                onTaskClick={(task) => console.log('Task clicked:', task)}
                                onStatusChange={handleStatusChange}
                                onDeleteTask={handleDeleteTask}
                                onEditTask={(task) => {
                                    setEditingTask(task);
                                    setIsDialogOpen(true);
                                }}
                                showAssignedTo={true}
                                allowEditDelete={true}
                            />
                        </div>

                        <TaskForm
                            employees={employees}
                            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                            currentUserPriority={currentUser.priority || 1}
                            isOpen={isDialogOpen}
                            onClose={() => {
                                setIsDialogOpen(false);
                                setEditingTask(null);
                            }}
                            initialData={editingTask || undefined}
                            isEditing={!!editingTask}
                        />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}