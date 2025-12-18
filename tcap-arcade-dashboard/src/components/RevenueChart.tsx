'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueChart({ data }: { data: { date: string; amount: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    tickFormatter={(value) => value.slice(5)} // Show MM-DD
                />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#8b5cf6' }}
                    activeDot={{ r: 6, fill: '#fff' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
