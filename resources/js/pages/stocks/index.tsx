import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

interface Stock {
    id: number;
    quantity: number;
    reorder_level: number;
    product: {
        name: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Stocks',
        href: '/stocks',
    },
];

export default function StockIndex() {
    const { stocks } = usePage<{ stocks: Stock[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Stocks</h1>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-orange-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Product
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Quantiity
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Reorder Level
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((s) => {
                                let status = 'OK';
                                let color = 'text-green-700 bg-green-100';
                                let icon = '✔';

                                if (s.quantity === s.reorder_level) {
                                    status = 'Ready to Order';
                                    color = 'text-yellow-700 bg-yellow-100';
                                    icon = '⚠';
                                }

                                if (s.quantity < s.reorder_level) {
                                    status = 'Reorder Needed';
                                    color = 'text-red-700 bg-red-100';
                                    icon = '🔴';
                                }

                                return (
                                    <tr
                                        key={s.id}
                                        className={
                                            'border-b last:border-0 dark:hover:bg-neutral-800'
                                        }
                                    >
                                        <td className="px-4 py-2">
                                            {s.product.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {s.quantity}
                                        </td>
                                        <td className="px-4 py-2">
                                            {s.reorder_level}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${color}`}
                                            >
                                                <span>{icon}</span>
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}

                            {stocks.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-4 text-center text-gray-500"
                                    >
                                        No stock data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AppLayout>
    );
}
