import style from '@/src/styles/admin.module.css';
import { Employee } from '@/src/types/types';

interface EmployeeListProps {
    employees: Employee[];
    onAdd: () => void;
    onEdit: (employee: Employee) => void;
    onAssignRoom: (employeeId: string) => void;
    error: string;
    isLoading: boolean;
}

export default function EmployeeList({
    employees,
    onAdd,
    onEdit,
    onAssignRoom,
    error,
    isLoading
}: EmployeeListProps) {
    return (
        <ul className={style.emplist}>
            <li style={{ color: '#656565' }}>
                <span>S.No.</span>
                <span>Name</span>
                <span>Email</span>
                <span>Room</span>
                <span onClick={onAdd}>Add...</span>
            </li>

            {error && <li className={style.errorRow}>{error}</li>}
            {isLoading && <li className={style.loadingRow}>Loading...</li>}

            {employees.map((employee, index) => (
                <li key={employee.id}>
                    <span>{index + 1}</span>
                    <span>{employee.fullName}</span>
                    <span>{employee.email}</span>
                    <span onClick={() => onAssignRoom(employee.id)}>
                        {employee.room?.name || 'N/A'}
                    </span>
                    <span onClick={() => onEdit(employee)}>Edit</span>
                </li>
            ))}
        </ul>
    );
}