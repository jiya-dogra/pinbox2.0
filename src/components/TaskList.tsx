import style from '@/src/styles/employee.module.css';
import { useState } from 'react';
import { Task } from '../types/types';
import { FaTrash, FaEdit } from 'react-icons/fa';

type TaskStatus = 'pending' | 'completed';

interface TaskListProps {
    tasks: Task[] | null | undefined;
    onTaskClick: (task: Task) => void;
    onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
    onEditTask: (task: Task) => void;
    showAssignedBy?: boolean;
    showAssignedTo?: boolean;
    allowEditDelete?: boolean;
}

export default function TaskList({
    tasks,
    onTaskClick,
    onStatusChange,
    onDeleteTask,
    onEditTask,
    showAssignedBy = false,
    showAssignedTo = false,
    allowEditDelete = true,
}: TaskListProps) {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [newStatus, setNewStatus] = useState<TaskStatus | null>(null);

    const handleStatusClick = (task: Task, e: React.MouseEvent) => {
        if (!allowEditDelete) return;
        e.stopPropagation();
        const nextStatus: TaskStatus = task.status === 'pending' ? 'completed' : 'pending';
        setSelectedTask(task);
        setNewStatus(nextStatus);
        setShowConfirm(true);
    };

    const handleDeleteClick = (task: Task, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedTask(task);
        setShowDeleteConfirm(true);
    };

    const handleEditClick = (task: Task, e: React.MouseEvent) => {
        e.stopPropagation();
        onEditTask(task);
    };

    const confirmStatusChange = () => {
        if (selectedTask && newStatus) {
            onStatusChange(selectedTask.id, newStatus);
        }
        setShowConfirm(false);
    };

    const confirmDelete = () => {
        if (selectedTask) {
            onDeleteTask(selectedTask.id);
        }
        setShowDeleteConfirm(false);
    };

    const cancelAction = () => {
        setShowConfirm(false);
        setShowDeleteConfirm(false);
        setSelectedTask(null);
        setNewStatus(null);
    };

    return (
        <div className={style.taskList}>
            {safeTasks.length > 0 ? (
                safeTasks.map(task => (
                    <div key={task.id} className={style.taskItem} onClick={() => onTaskClick(task)}>
                        <div>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            {showAssignedBy && task.assignedBy && (
                                <p>Assigned By: {task.assignedBy.fullName}</p>
                            )}
                            {showAssignedTo && task.assignedTo && (
                                <p>Assigned To: {task.assignedTo.fullName}</p>
                            )}
                            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'end', alignItems: 'end', justifyContent: 'space-between' }}>
                            <p
                                title='Change Status'
                                className={`${style.taskStatus} ${style[task.status]} ${!allowEditDelete ? style.disabledStatus : ''
                                    }`}
                                onClick={(e) => handleStatusClick(task, e)}
                            >
                                {task.status}
                            </p>
                            {allowEditDelete && (
                                <>
                                    <FaEdit
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditTask?.(task);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        title="Edit Task"
                                    />
                                    <FaTrash
                                        onClick={(e) => handleDeleteClick(task, e)}
                                        style={{ cursor: 'pointer' }}
                                        title="Delete Task"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className={style.noTasks}>No tasks found</p>
            )}

            {/* Status Change Confirmation Dialog */}
            {showConfirm && selectedTask && newStatus && (
                <div className={style.dialogOverlay}>
                    <div className={style.dialog}>
                        <h2>Confirm Status Change</h2>
                        <p>Are you sure you want to change this task from "{selectedTask.status}" to "{newStatus}"?</p>
                        <button
                            onClick={cancelAction}
                            className={style.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmStatusChange}
                            className={style.submitButton}
                            style={{ marginLeft: '2em' }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && selectedTask && (
                <div className={style.dialogOverlay}>
                    <div className={style.dialog}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete the task "{selectedTask.title}"?</p>
                        <p>This action cannot be undone.</p>
                        <button
                            onClick={cancelAction}
                            className={style.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className={style.submitButton}
                            style={{ marginLeft: '2em', backgroundColor: '#ff4444', color: 'white' }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}