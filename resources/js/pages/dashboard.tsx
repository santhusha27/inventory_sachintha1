import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import {
    AlertTriangle,
    ArrowUpRight,
    DollarSign,
    Package,
    ShoppingCart,
    Truck,
    XCircle,
} from 'lucide-react';

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Stats {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    totalSuppliers: number;
    stockValue: number;
    totalPurchases: number;
    totalSales: number;
    totalIncome: number;
}

interface ChartStock {
    name: string;
    quantity: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { stats, chartStocks } = usePage<{
        stats: Stats;
        chartStocks: ChartStock[];
    }>().props;

    const cards = [
        {
            title: 'Products',
            value: stats.totalProducts,
            icon: Package,
            href: '/products',
        },
        {
            title: 'Low Stock',
            value: stats.lowStock,
            icon: AlertTriangle,
            href: '/stocks',
        },
        {
            title: 'Out of Stock',
            value: stats.outOfStock,
            icon: XCircle,
            href: '/stocks',
        },
        {
            title: 'Suppliers',
            value: stats.totalSuppliers,
            icon: Truck,
            href: '/suppliers',
        },
        {
            title: 'Sales',
            value: stats.totalSales,
            icon: ShoppingCart,
            href: '/sales',
        },
        {
            title: 'Income',
            value: `Rs. ${Number(stats.totalIncome).toLocaleString()}`,
            icon: DollarSign,
            href: '/sales',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-screen">
                {/* HEADER */}
                <div className="border-b border-orange-500 px-8 py-8">
                    <h1 className="text-4xl font-bold text-orange-500">
                        Sachintha Book Shop
                    </h1>

                    <p className="mt-2 text-gray-300">
                        Inventory Management Dashboard
                    </p>

                    {/* CARDS */}
                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-6">
                        {cards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <Card
                                    key={card.title}
                                    onClick={() => router.get(card.href)}
                                    className="cursor-pointer border border-orange-500 bg-[#111111] p-5 transition-all hover:scale-105 hover:bg-[#1b1b1b]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                {card.title}
                                            </p>

                                            <h2 className="mt-2 text-3xl font-bold text-orange-500">
                                                {card.value}
                                            </h2>
                                        </div>

                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                                            <Icon className="h-6 w-6 text-black" />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <ArrowUpRight className="h-5 w-5 text-orange-500" />
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* BODY */}
                <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-4">
                    {/* LEFT PANEL */}
                    <div className="rounded-xl border border-orange-500 bg-[#111111] p-8 text-white lg:col-span-1">
                        <h2 className="text-2xl font-bold text-orange-500">
                            Stock Value
                        </h2>

                        <p className="mt-6 text-4xl font-bold">
                            Rs. {Number(stats.stockValue).toLocaleString()}
                        </p>

                        <div className="my-10 border-t border-orange-500"></div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold">
                                    Purchases
                                </p>

                                <p className="text-xl font-bold text-orange-500">
                                    {stats.totalPurchases}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold">Sales</p>

                                <p className="text-xl font-bold text-orange-500">
                                    {stats.totalSales}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold">Income</p>

                                <p className="text-xl font-bold text-orange-500">
                                    Rs.{' '}
                                    {Number(stats.totalIncome).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CHART */}
                    <div className="lg:col-span-3">
                        <Card className="h-full border border-orange-500 bg-[#111111] p-8">
                            <h2 className="mb-6 text-center text-3xl font-bold text-orange-500">
                                Product Stock Levels
                            </h2>

                            <div className="h-[450px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartStocks}>
                                        <CartesianGrid stroke="#333" />

                                        <XAxis
                                            dataKey="name"
                                            stroke="#ffffff"
                                        />

                                        <YAxis stroke="#ffffff" />

                                        <Tooltip />

                                        <Bar
                                            dataKey="quantity"
                                            fill="#f97316"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
