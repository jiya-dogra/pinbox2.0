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
            <li>
                <span style={{ textAlign: 'center' }}>S.No.</span>
                <span>Name</span>
                <span>Email</span>
                <span>Room</span>
                <span onClick={onAdd}>Add...</span>
            </li>

            {error && <li>{error}</li>}
            {isLoading && <li>Loading...</li>}

            {employees
                .sort((a, b) => a.fullName.localeCompare(b.fullName))
                .map((employee, index) => (
                    <li key={employee.id}>
                        <span style={{ textAlign: 'center' }}>{index + 1}</span>
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