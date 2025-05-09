import style from '@/src/styles/admin.module.css';

export default function EmployeeBars({
    data = []
}: {
    data: Array<{ name: string; count: number }>;
}) {
    const maxCount = Math.max(...data.map(r => r.count), 1);

    return (
        <div className={style.chartCard}>
            <h3>Employees Per Room</h3>
            <div className={style.horizontalBars}>
                {data
                    .sort((a, b) => b.count - a.count)
                    .map((room) => (
                        <div key={room.name} className={style.barItem}>
                            <span className={style.barLabel}>{room.name}</span>
                            <div className={style.barTrack}>
                                <div
                                    className={style.barFill}
                                    style={{
                                        width: `${Math.min(100, (room.count / maxCount) * 100)}%`
                                    }}
                                >
                                    <span className={style.barCount}>{room.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}