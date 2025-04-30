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

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: Date;
    status: 'pending' | 'in-progress' | 'completed';
    assignedById: string;
    assignedToId: string;
    assignedBy?: {
        fullName: string;
    };
    createdAt: Date;
}