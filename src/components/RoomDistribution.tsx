import style from '@/src/styles/admin.module.css';

export default function RoomDistribution({
    data = []
}: {
    data: Array<{ name: string; count: number }>;
}) {
    return (
        <div className={style.chartCard}>
            <h3>Employees Distribution</h3>
            <div className={style.distributionGrid}>
                {data
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 8)
                    .map((room) => (
                        <div key={room.name} className={style.gridItem}>
                            <div>{room.name}</div>
                            <div className={style.employeeDots}>
                                {Array.from({ length: Math.min(room.count, 10) }).map((_, i) => (
                                    <div key={i} className={style.dot} />
                                ))}
                                {room.count > 10 && (
                                    <div className={style.moreIndicator}>+{room.count - 10}</div>
                                )}
                            </div>
                            <div className={style.countLabel}>{room.count} people</div>
                        </div>
                    ))}
                {data.length > 8 && (
                    <div className={style.moreRooms}>
                        +{data.length - 8} more rooms
                    </div>
                )}
            </div>
        </div>
    );
}