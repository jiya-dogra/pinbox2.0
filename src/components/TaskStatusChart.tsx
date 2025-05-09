import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import style from '@/src/styles/employee.module.css';

const COLORS = ['#ffffff', '#9dceed', '#556169'];

interface TaskStatusChartProps {
    data?: Array<{ name: string; value: number }>;
    isLoading: boolean;
}

export const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return <div className={style.chartContainer}>Loading chart...</div>;
    }

    return (
        <div className={style.chartContainer}>
            <h3>Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {data?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};