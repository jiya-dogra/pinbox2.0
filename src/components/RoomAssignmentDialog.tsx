import style from '@/src/styles/admin.module.css';
import { Room } from '@/src/types/types';

interface RoomAssignmentDialogProps {
    isOpen: boolean;
    rooms: Room[];
    onAssign: (roomId: string) => void;
    onClose: () => void;
}

export default function RoomAssignmentDialog({
    isOpen,
    rooms,
    onAssign,
    onClose
}: RoomAssignmentDialogProps) {
    if (!isOpen) return null;

    return (
        <div className={style.dialogOverlay}>
            <div className={style.dialog}>
                <h2>Assign Room</h2>
                <div className={style.roomList}>
                    {rooms.map(room => (
                        <div
                            key={room.id}
                            className={style.roomItem}
                            onClick={() => onAssign(room.id)}
                        >
                            {room.name} ({room._count.users || 0})
                        </div>
                    ))}
                </div>
                <div className={style.buttonGroup}>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}