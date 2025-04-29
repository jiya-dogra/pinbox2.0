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