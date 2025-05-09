import { BiSolidEdit } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import style from '@/src/styles/admin.module.css';
import { Room } from '@/src/types/types';

interface RoomListProps {
    rooms: Room[];
    onAdd: () => void;
    onEdit: (room: Room, index: number) => void;
    onDelete: (id: string) => void;
    error: string;
    isLoading: boolean;
    onMembersClick: (room: Room) => void;
}

export default function RoomList({
    rooms,
    onAdd,
    onEdit,
    onDelete,
    error,
    isLoading,
    onMembersClick
}: RoomListProps) {
    return (
        <ul className={style.roomlist}>
            <li>
                <span style={{ justifySelf: 'center' }}>S.No.</span>
                <span>Room Name</span>
                <span>Members</span>
                <span
                    style={{ justifySelf: 'center', cursor: 'pointer' }}
                    onClick={onAdd}
                >
                    Add...
                </span>
            </li>

            {error && (
                <li className={style.errorRow}>
                    <span style={{ gridColumn: '1 / -1' }}>{error}</span>
                </li>
            )}

            {isLoading && !error && (
                <li className={style.loadingRow}>
                    <span style={{ gridColumn: '1 / -1' }}>Loading rooms...</span>
                </li>
            )}

            {rooms
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((room, index) => (
                    <li key={room.id}>
                        <span style={{ justifySelf: 'center' }}>{index + 1}</span>
                        <span>{room.name}</span>
                        <span
                            onClick={() => onMembersClick(room)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {room._count.users} members
                        </span>
                        <span style={{
                            justifySelf: 'center',
                            display: 'flex',
                            gap: '0.5rem'
                        }}>
                            <BiSolidEdit
                                onClick={() => onEdit(room, index)}
                                style={{ cursor: 'pointer' }}
                                title="Edit"
                            />
                            <AiOutlineDelete
                                onClick={() => onDelete(room.id)}
                                style={{ cursor: 'pointer' }}
                                title="Delete"
                            />
                        </span>
                    </li>
                ))}
        </ul>
    );
}