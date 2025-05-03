import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import style from '@/src/styles/employee.module.css';

interface TaskDueDateChartProps {
    data?: Array<{ week: string; count: number }>;
    isLoading: boolean;
}

export const TaskDueDateChart: React.FC<TaskDueDateChartProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return <div className={style.chartContainer}>Loading chart...</div>;
    }

    return (
        <div className={style.chartContainer}>
            <h3>Tasks by Due Date</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Tasks" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};