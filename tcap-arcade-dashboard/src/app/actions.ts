'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Today's Income
    const todayIncome = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
            type: 'INCOME',
            date: { gte: startOfDay }
        }
    });

    // Monthly Income
    const monthIncome = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
            type: 'INCOME',
            date: { gte: startOfMonth }
        }
    });

    // Monthly Expense
    const monthExpense = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
            type: 'EXPENSE',
            date: { gte: startOfMonth }
        }
    });

    return {
        todayIncome: todayIncome._sum.amount || 0,
        monthIncome: monthIncome._sum.amount || 0,
        monthExpense: monthExpense._sum.amount || 0,
        netProfit: (monthIncome._sum.amount || 0) - (monthExpense._sum.amount || 0)
    };
}

export async function getRevenueChartData() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7); // Last 7 days

    const transactions = await prisma.transaction.findMany({
        where: {
            type: 'INCOME',
            date: { gte: startDate }
        },
        orderBy: {
            date: 'asc'
        }
    });

    // Group by day locally (sqlite group by date is tricky with prisma sometimes)
    const grouped = new Map<string, number>();

    // Initialize last 7 days with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        grouped.set(dateStr, 0);
    }

    transactions.forEach(t => {
        const dateStr = t.date.toISOString().split('T')[0];
        const current = grouped.get(dateStr) || 0;
        grouped.set(dateStr, current + t.amount);
    });

    const result = Array.from(grouped.entries()).map(([date, amount]) => ({
        date,
        amount
    }));

    return result;
}

export async function getTransactions() {
    return await prisma.transaction.findMany({
        orderBy: {
            date: 'desc'
        },
        take: 50 // Limit to last 50 for now
    });
}

export async function deleteTransaction(id: number) {
    await prisma.transaction.delete({
        where: { id }
    });
    revalidatePath('/');
    revalidatePath('/accounting');
}

export async function addTransaction(formData: FormData) {
    const type = formData.get('type') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    await prisma.transaction.create({
        data: {
            type,
            amount,
            category,
            description,
            date: new Date()
        }
    });

    revalidatePath('/');
}

// Bulk Import Action
export async function importTransactions(transactions: { date: string; amount: number; type: string; category: string; description: string }[]) {
    const data = transactions.map(t => ({
        date: new Date(t.date),
        amount: t.amount,
        type: t.type,
        category: t.category,
        description: t.description || 'Imported via CSV'
    }));

    for (const item of data) {
        await prisma.transaction.create({
            data: item
        });
    }

    revalidatePath('/');
    revalidatePath('/accounting');
}
