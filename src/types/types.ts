export interface Room {
    id: string;
    name: string;
    _count: {
        users: number;
    };
}

export interface Employee {
    id: string;
    fullName: string;
    email: string;
    password: string;
    companyId: string;
    room?: {
        id: string;
        name: string;
    } | null;
    createdAt?: string | Date;
    priority?: number;
}

export type TaskStatus = 'pending' | 'completed';

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: Date;
    status: 'pending' | 'completed';
    assignedById: string;
    assignedToId: string;
    assignedTo?: {
        fullName: string;
    };
    assignedBy?: {
        fullName: string;
    };
    createdAt: Date;
}