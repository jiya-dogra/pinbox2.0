import style from '@/src/styles/employee.module.css';

interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: Date | string;
    status: string;
    assignedBy?: {
        fullName: string;
    };
}

interface TaskListProps {
    tasks: Task[] | null | undefined; // Handle all possible types
    onTaskClick: (task: Task) => void;
}

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
    // Safeguard against non-array tasks
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    return (
        <div className={style.taskList}>
            {safeTasks.length > 0 ? (
                safeTasks.map(task => (
                    <div key={task.id} className={style.taskItem} onClick={() => onTaskClick(task)}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <div className={style.taskMeta}>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            <span className={`${style.taskStatus} ${style[task.status]}`}>
                                {task.status}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <p className={style.noTasks}>No tasks found</p>
            )}
        </div>
    );
}